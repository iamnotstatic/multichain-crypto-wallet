import axios from 'axios';

import { DEFAULT_TIMEOUT } from './timeout';

export const MULTICHAIN_URLS = {
  BTC: 'https://multichain-web-proxy.herokuapp.com/multichain-bitcoin',
  BTCTEST:
    'https://multichain-web-proxy.herokuapp.com/multichain-bitcoin-testnet',
  ZEC: 'https://multichain-web-proxy.herokuapp.com/multichain-zcash',
  ZECTEST:
    'https://multichain-web-proxy.herokuapp.com/multichain-zcash-testnet',
  BCH: 'https://multichain-web-proxy.herokuapp.com/multichain-bitcoincash',
  BCHTEST:
    'https://multichain-web-proxy.herokuapp.com/multichain-bitcoincash-testnet',
};

const broadcastTransaction = (url: string) => async (
  txHex: string
): Promise<string> => {
  const response = await axios.post<{
    result: string;
    error: null;
    id: string | number;
  }>(
    url,
    {
      jsonrpc: '1.0',
      id: '67',
      method: 'sendrawtransaction',
      params: [txHex],
    },
    { timeout: DEFAULT_TIMEOUT }
  );

  return response.data.result;
};

export const JSONRPC = {
  broadcastTransaction,
};
