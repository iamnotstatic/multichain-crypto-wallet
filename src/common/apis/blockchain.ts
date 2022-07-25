import axios from 'axios';
import { URLSearchParams } from 'url';

import { sortUTXOs, UTXO } from '../utils/utxo';
import { DEFAULT_TIMEOUT } from './timeout';

export enum BlockchainNetwork {
  Bitcoin = 'btc',
  BitcoinCash = 'bch',
  BitcoinTestnet = 'btc-testnet',
  BitcoinCashTestnet = 'bch-testnet',
}

interface BlockchainTransaction {
  txid: string; // "550b293355f5274e513c65f846311fd5817d13bcfcd492ab94ff2725ba94f21e"
  size: number; // 124
  version: number; // 1
  locktime: number; // 0
  fee: number; // 0
  inputs: [
    {
      coinbase: boolean; // true
      txid: string; // "0000000000000000000000000000000000000000000000000000000000000000"
      output: number; // 4294967295
      sigscript: string; // "03e3b9162f696d2f"
      sequence: number; // 4294967295
      pkscript: null;
      value: null;
      address: null;
      witness: unknown[];
    }
  ];
  outputs: [
    {
      address: string; // "bchtest:qp7k5sm9dcmvse2rgmkj2ktylm9fgqcnv5kp2hrs0h"
      pkscript: string; // "76a9147d6a43656e36c8654346ed255964feca9403136588ac"
      value: number; // 39062500
      spent: boolean; // false
      spender: null;
    },
    {
      address: null;
      pkscript: string; // "6a14883805620000000000000000faee4177fe240000"
      value: number; // 0
      spent: boolean; // false
      spender: null;
    }
  ];
  block: {
    height?: number; // 1489379
    position?: number; // 0
    mempool?: number;
  };
  deleted: boolean; // false
  time: number; // 1646186011
  rbf: boolean; // false
  weight: number; // 496
}

const fetchLatestBlock = async (
  network: BlockchainNetwork
): Promise<number> => {
  const statsUrl = `https://api.blockchain.info/haskoin-store/${network}/block/best?notx=true`;
  const statsResponse = (await axios.get<{ height: number }>(statsUrl)).data;
  return statsResponse.height;
};

const fetchUTXO = (network: BlockchainNetwork) => async (
  txHash: string,
  vOut: number
): Promise<UTXO> => {
  const url = `https://api.blockchain.info/haskoin-store/${network}/transaction/${txHash}`;

  const response = (
    await axios.get<BlockchainTransaction>(`${url}`, {
      timeout: DEFAULT_TIMEOUT,
    })
  ).data;

  const confirmations =
    !response.block || !response.block.height
      ? 0
      : Math.max(
          (await fetchLatestBlock(network)) - response.block.height + 1,
          0
        );

  return {
    txHash,
    block: response.block && response.block.height ? response.block.height : 0,
    amount: response.outputs[vOut].value,
    confirmations,
  };
};

const fetchUTXOs = (network: BlockchainNetwork) => async (
  address: string,
  confirmations: number,
  limit: number = 25,
  offset: number = 0
): Promise<readonly UTXO[]> =>
  fetchTXs(network)(address, confirmations, limit, offset, true);

const fetchTXs = (network: BlockchainNetwork) => async (
  address: string,
  confirmations: number = 0,
  limit: number = 25,
  offset: number = 0,
  onlyUnspent: boolean = false
): Promise<readonly UTXO[]> => {
  const url = `https://api.blockchain.info/haskoin-store/${network}/address/${address}/transactions/full?limit=${limit}&offset=${offset}`;
  const response = (
    await axios.get<BlockchainTransaction[]>(url, {
      timeout: DEFAULT_TIMEOUT,
    })
  ).data;

  let latestBlock: number | undefined;

  const received: UTXO[] = [];

  for (const tx of response) {
    latestBlock = latestBlock || (await fetchLatestBlock(network));
    const txConfirmations =
      tx.block && tx.block.height
        ? Math.max(latestBlock - tx.block.height + 1, 0)
        : 0;
    for (let i = 0; i < tx.outputs.length; i++) {
      const vout = tx.outputs[i];
      if (
        vout.address === address &&
        // If the onlyUnspent flag is true, check that the tx is unspent.
        (!onlyUnspent || vout.spent === false)
      ) {
        received.push({
          txHash: tx.txid,
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

export const broadcastTransaction = (network: BlockchainNetwork) => async (
  txHex: string
): Promise<string> => {
  if (network !== BlockchainNetwork.Bitcoin) {
    throw new Error(
      `Broadcasting ${network} transactions not supported by endpoint.`
    );
  }
  const url = `https://blockchain.info/pushtx`;

  const params = new URLSearchParams();
  params.append('tx', txHex);

  const response = await axios.post(url, params, {
    timeout: DEFAULT_TIMEOUT,
  });
  if ((response.data as any).error) {
    throw new Error((response.data as any).error);
  }

  return response.data;
};

export const Blockchain = {
  networks: BlockchainNetwork,
  fetchUTXO,
  fetchUTXOs,
  broadcastTransaction,
  fetchTXs,
};
