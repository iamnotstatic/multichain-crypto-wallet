import axios from 'axios';

import { sortUTXOs, UTXO } from '../utils/utxo';
import { DEFAULT_TIMEOUT } from './timeout';

const fetchUTXO = (network: string) => async (
  txHash: string,
  vOut: number
): Promise<UTXO> => {
  const url = `https://api.blockchair.com/${network}/dashboards/transaction/${txHash}`;

  const response = (
    await axios.get<TransactionResponse>(`${url}`, {
      timeout: DEFAULT_TIMEOUT,
    })
  ).data;

  if (!response.data[txHash]) {
    throw new Error(`Transaction not found.`);
  }

  const tx = response.data[txHash];

  let latestBlock = response.context.state;
  if (latestBlock === 0) {
    const statsUrl = `https://api.blockchair.com/${network}/stats`;
    const statsResponse = (await axios.get(statsUrl)).data;
    latestBlock = statsResponse.data.blocks - 1;
  }

  const confirmations =
    tx.transaction.block_id === -1
      ? 0
      : Math.max(latestBlock - tx.transaction.block_id + 1, 0);

  return {
    txHash,
    block: tx.transaction.block_id === -1 ? 0 : tx.transaction.block_id,
    amount: tx.outputs[vOut].value,
    confirmations,
  };
};

const fetchUTXOs = (network: string) => async (
  address: string,
  confirmations: number
): Promise<readonly UTXO[]> => {
  const url = `https://api.blockchair.com/${network}/dashboards/address/${address}?limit=0,100`;
  const response = (
    await axios.get<AddressResponse>(url, { timeout: DEFAULT_TIMEOUT })
  ).data;

  let latestBlock = response.context.state;
  if (latestBlock === 0) {
    const statsUrl = `https://api.blockchair.com/${network}/stats`;
    const statsResponse = (await axios.get(statsUrl)).data;
    latestBlock = statsResponse.data.blocks - 1;
  }

  return response.data[address].utxo
    .map(utxo => ({
      txHash: utxo.transaction_hash,
      amount: utxo.value,
      vOut: utxo.index,
      confirmations: utxo.block_id === -1 ? 0 : latestBlock - utxo.block_id + 1,
    }))
    .filter(utxo => confirmations === 0 || utxo.confirmations >= confirmations)
    .sort(sortUTXOs);
};

const fetchTXs = (network: string) => async (
  address: string,
  confirmations: number = 0,
  limit: number = 25
): Promise<readonly UTXO[]> => {
  const url = `https://api.blockchair.com/${network}/dashboards/address/${address}?limit=${limit},0`;
  const response = (
    await axios.get<AddressResponse>(url, { timeout: DEFAULT_TIMEOUT })
  ).data;

  let latestBlock = response.context.state;
  if (latestBlock === 0) {
    const statsUrl = `https://api.blockchair.com/${network}/stats`;
    const statsResponse = (await axios.get(statsUrl)).data;
    latestBlock = statsResponse.data.blocks - 1;
  }

  const txHashes = response.data[address].transactions;

  let txDetails: { [txHash: string]: TransactionResponse['data'][''] } = {};

  // Fetch in sets of 10
  for (let i = 0; i < Math.ceil(txHashes.length / 10); i++) {
    const txUrl = `https://api.blockchair.com/${network}/dashboards/transactions/${txHashes
      .slice(i * 10, (i + 1) * 10)
      .join(',')}`;
    const txResponse = (
      await axios.get<TransactionResponse>(txUrl, {
        timeout: DEFAULT_TIMEOUT,
      })
    ).data;
    txDetails = {
      ...txDetails,
      ...txResponse.data,
    };
  }

  const received: UTXO[] = [];

  for (const txHash of txHashes) {
    const tx = txDetails[txHash];
    const txConfirmations =
      tx.transaction.block_id === -1
        ? 0
        : Math.max(latestBlock - tx.transaction.block_id + 1, 0);
    for (let i = 0; i < tx.outputs.length; i++) {
      const vout = tx.outputs[i];
      if (vout.recipient === address) {
        received.push({
          txHash: tx.transaction.hash,
          amount: vout.value,
          vOut: i,
          confirmations: txConfirmations,
        });
      }
    }
  }

  return received
    .filter(utxo => confirmations === 0 || utxo.confirmations >= confirmations)
    .sort(sortUTXOs);
};

export const broadcastTransaction = (network: string) => async (
  txHex: string
): Promise<string> => {
  const url = `https://api.blockchair.com/${network}/push/transaction`;
  const response = await axios.post<{ data: { transaction_hash: string } }>(
    url,
    { data: txHex },
    { timeout: DEFAULT_TIMEOUT }
  );
  if ((response.data as any).error) {
    throw new Error((response.data as any).error);
  }

  return response.data.data.transaction_hash;
};

enum Networks {
  BITCOIN = 'bitcoin',
  BITCOIN_CASH = 'bitcoin-cash',
  LITECOIN = 'litecoin',
  BITCOIN_SV = 'bitcoin-sv',
  DOGECOIN = 'dogecoin',
  DASH = 'dash',
  GROESTLCOIN = 'groestlcoin',
  BITCOIN_TESTNET = 'bitcoin/testnet',
}

export const Blockchair = {
  networks: Networks,
  fetchUTXO,
  fetchUTXOs,
  broadcastTransaction,
  fetchTXs,
};

interface BlockchairContext {
  code: number; // 200
  source: string; // "D"
  time: number; // 0.2793741226196289
  limit: string; // "0,100"
  offset: string; // "0,0"
  results: number; // 0
  state: number; // 611807
  cache: {
    live: boolean;
    duration: number;
    since: string;
    until: string;
    time: null;
  };
  api: {
    version: string;
    last_major_update: string;
    next_major_update: null | string;
    documentation: 'https://blockchair.com/api/docs';
    notice?: string;
  };
}

/** TYPES */

interface AddressResponse {
  data: {
    [addr: string]: {
      address: {
        type: 'pubkey';
        script_hex: string; // "4104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac"
        balance: number; // 6820995737
        balance_usd: number; // 527582.1930705917
        received: number; // 6820995737
        received_usd: number; // 15963.6287
        spent: number; // 0
        spent_usd: number; // 0
        output_count: number; // 1924
        unspent_output_count: number; // 1924
        first_seen_receiving: string; // "2009-01-03 18:15:05"
        last_seen_receiving: string; // "2020-01-07 22:38:01"
        first_seen_spending: null;
        last_seen_spending: null;
        transaction_count: null;
      };
      transactions: string[];
      utxo: Array<{
        block_id: number; // 611802,
        transaction_hash: string; // "f3c8e9b5964703f5634261a6769d6c9d836e3175fbfbebd204837aa15ef382f7"
        index: number; // 29
        value: number; // 7043123
      }>;
    };
  };
  context: BlockchairContext;
}

interface InputOrOutput {
  block_id: number; // 9
  transaction_id: number; // 9
  index: number; // 0
  transaction_hash: string; // "0437cd7f8525ceed2324359c2d0ba26006d92d856a9c20fa0241106ee5a597c9"
  date: string; // "2009-01-09"
  time: string; // "2009-01-09 03:54:39"
  value: number; // 5000000000
  value_usd: number; // 0.5
  recipient: string; // "12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S"
  type: string; // "pubkey"
  script_hex: string; // "410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac"
  is_from_coinbase: boolean; // true
  is_spendable: boolean; // true
  is_spent: boolean; // true
  spending_block_id: number; // 170,
  spending_transaction_id: number; // 171,
  spending_index: number; // 0,
  spending_transaction_hash: string; // "f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16"
  spending_date: string; // "2009-01-12"
  spending_time: string; // "2009-01-12 03:30:25"
  spending_value_usd: number; // 0.5
  spending_sequence: number; // 4294967295
  spending_signature_hex: string; // "47304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901"
  spending_witness: string; // ""
  lifespan: number; // 257746
  cdd: number; // 149.15856481481
}

interface TransactionResponse {
  data: {
    [utxo: string]: {
      transaction: {
        block_id: number; // 170
        id: number; // 171
        hash: string; // "f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16"
        date: string; // "2009-01-12"
        time: string; // "2009-01-12 03:30:25"
        size: number; // 275
        weight: number; // 1100
        version: number; // 1
        lock_time: number; // 0
        is_coinbase: boolean; // false
        has_witness: boolean; // false
        input_count: number; // 1
        output_count: number; // 2
        input_total: number; // 5000000000
        input_total_usd: number; // 0.5
        output_total: number; // 5000000000
        output_total_usd: number; // 0.5
        fee: number; // 0
        fee_usd: number; // 0
        fee_per_kb: number; // 0
        fee_per_kb_usd: number; // 0
        fee_per_kwu: number; // 0
        fee_per_kwu_usd: number; // 0
        cdd_total: number; // 149.15856481481
        is_rbf: boolean;
      };
      inputs: InputOrOutput[];
      outputs: InputOrOutput[];
    };
  };
  context: BlockchairContext;
}
