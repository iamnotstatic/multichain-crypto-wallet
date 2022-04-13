import * as solanaWeb3 from '@solana/web3.js';

const provider = (rpcUrl?: string) => {
  return new solanaWeb3.Connection(rpcUrl || 'https://rpc.ankr.com/solana');
};

export default provider;
