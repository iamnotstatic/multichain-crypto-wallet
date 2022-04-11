import * as solanaWeb3 from '@solana/web3.js';

const provider = (rpcUrl: string) => {
  const connection = new solanaWeb3.Connection(rpcUrl);
  return connection;
};

export default provider;
