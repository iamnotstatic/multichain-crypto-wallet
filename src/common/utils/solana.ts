import * as solanaWeb3 from '@solana/web3.js';

const provider = (rpcUrl?: string) => {
  return new solanaWeb3.Connection(rpcUrl as string);
};

export default provider;
