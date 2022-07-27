import axios from 'axios';

import { sortUTXOs, UTXO } from '../utils/utxo';

const getURL = (network: string, testnet: boolean) =>
  `https://multichain-web-proxy.herokuapp.com/electrumx-${network}-${
    testnet ? 'testnet' : 'mainnet'
  }`;

const fetchUTXOs = (network: string, testnet: boolean) => async (
  address: string,
  confirmations: number,
  scriptHash?: string
): Promise<readonly UTXO[]> => {
  if (!scriptHash) {
    throw new Error('Must provide script hash.' + address);
  }
  const url = getURL(network, testnet);

  const latestBlock = (
    await axios.post<{
      result: {
        hex: string;
        height: number;
      };
      error: null;
      id: number;
    }>(url, {
      jsonrpc: '1.0',
      id: '67',
      method: 'blockchain.scripthash.listunspent',
      params: [scriptHash],
    })
  ).data.result.height;

  const response = await axios.post<{
    result: [
      {
        tx_hash: string; // "fd742de094de839845c1c94e4e5d1804b3f869c2b5a777fc33792e68719ce113";
        tx_pos: number; // 0;
        height: number; // 2001083;
        value: number; // 100000;
      }
    ];
    error: null;
    id: '67';
  }>(url, {
    jsonrpc: '1.0',
    id: '67',
    method: 'blockchain.scripthash.listunspent',
    params: [scriptHash],
  });
  return response.data.result
    .map(utxo => ({
      txHash: utxo.tx_hash,
      amount: utxo.value,
      vOut: utxo.tx_pos,
      confirmations: utxo.height ? 1 + latestBlock - utxo.height : 0,
    }))
    .filter(utxo => confirmations === 0 || utxo.confirmations >= confirmations)
    .sort(sortUTXOs);
};

export const ElectrumX = {
  fetchUTXOs,
};
