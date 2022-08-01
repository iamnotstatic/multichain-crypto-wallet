import axios from 'axios';

import { sortUTXOs, UTXO } from '../utils/utxo';
import { DEFAULT_TIMEOUT } from './timeout';

interface BlockstreamUTXO<vout = number> {
  status:
    | {
        confirmed: false;
      }
    | {
        confirmed: true;
        block_height: number;
        block_hash: string;
        block_time: number;
      };
  txid: string;
  value: number;
  vout: vout; // vout is a number for utxos, or an array of utxos for a tx
}

interface BlockstreamTX
  extends BlockstreamUTXO<
    Array<{
      scriptpubkey: string;
      scriptpubkey_asm: string;
      scriptpubkey_type: string;
      scriptpubkey_address: string;
      value: number; // e.g. 1034439
    }>
  > {
  version: number;
  locktime: number;
  vin: Array<{
    txid: string;
    vout: number;
    prevout: any;
    scriptsig: string;
    scriptsig_asm: string;
    is_coinbase: false;
    sequence: number;
  }>;
  size: number;
  weight: number;
  fee: number;
}

const getAPIUrl = (testnet: boolean) =>
  `https://blockstream.info/${testnet ? 'testnet/' : ''}api`;

const fetchUTXO = (testnet: boolean) => async (
  txHash: string,
  vOut: number
): Promise<UTXO> => {
  const apiUrl = getAPIUrl(testnet);
  const utxo = (
    await axios.get<BlockstreamTX>(`${apiUrl}/tx/${txHash}`, {
      timeout: DEFAULT_TIMEOUT,
    })
  ).data;

  const heightResponse = (
    await axios.get<string>(`${apiUrl}/blocks/tip/height`, {
      timeout: DEFAULT_TIMEOUT,
    })
  ).data;

  const confirmations = utxo.status.confirmed
    ? Math.max(1 + parseInt(heightResponse, 10) - utxo.status.block_height, 0)
    : 0;

  return {
    txHash,
    block: utxo.status.confirmed ? utxo.status.block_height : 0,
    amount: utxo.vout[vOut].value,
    confirmations,
  };
};

const fetchUTXOs = (testnet: boolean) => async (
  address: string,
  confirmations: number
): Promise<readonly UTXO[]> => {
  const apiUrl = getAPIUrl(testnet);
  const response = await axios.get<ReadonlyArray<BlockstreamUTXO>>(
    `${apiUrl}/address/${address}/utxo`,
    { timeout: DEFAULT_TIMEOUT }
  );

  const heightResponse = await axios.get<string>(
    `${apiUrl}/blocks/tip/height`,
    { timeout: DEFAULT_TIMEOUT }
  );

  return response.data
    .map(utxo => ({
      txHash: utxo.txid,
      amount: utxo.value,
      vOut: utxo.vout,
      confirmations: utxo.status.confirmed
        ? 1 + parseInt(heightResponse.data, 10) - utxo.status.block_height
        : 0,
    }))
    .filter(utxo => confirmations === 0 || utxo.confirmations >= confirmations)
    .sort(sortUTXOs);
};

const fetchTXs = (testnet: boolean) => async (
  address: string,
  confirmations: number = 0
): Promise<readonly UTXO[]> => {
  const apiUrl = getAPIUrl(testnet);

  const response = await axios.get<ReadonlyArray<BlockstreamTX>>(
    `${apiUrl}/address/${address}/txs`,
    { timeout: DEFAULT_TIMEOUT }
  );

  const heightResponse = await axios.get<string>(
    `${apiUrl}/blocks/tip/height`,
    { timeout: DEFAULT_TIMEOUT }
  );

  const received: UTXO[] = [];

  for (const tx of response.data) {
    for (let i = 0; i < tx.vout.length; i++) {
      const vout = tx.vout[i];
      if (vout.scriptpubkey_address === address) {
        received.push({
          txHash: tx.txid,
          amount: vout.value,
          vOut: i,
          confirmations: tx.status.confirmed
            ? 1 + parseInt(heightResponse.data, 10) - tx.status.block_height
            : 0,
        });
      }
    }
  }

  return received
    .filter(utxo => confirmations === 0 || utxo.confirmations >= confirmations)
    .sort(sortUTXOs);
};

const broadcastTransaction = (testnet: boolean) => async (
  txHex: string
): Promise<string> => {
  const apiUrl = getAPIUrl(testnet);
  const response = await axios.post<string>(`${apiUrl}/tx`, txHex, {
    timeout: DEFAULT_TIMEOUT,
  });

  return response.data;
};

export const Blockstream = {
  fetchUTXO,
  fetchUTXOs,
  broadcastTransaction,
  fetchTXs,
};
