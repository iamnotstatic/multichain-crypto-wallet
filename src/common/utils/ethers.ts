import { ethers } from 'ethers';
import HDWalletProvider from '@truffle/hdwallet-provider';

const provider = (rpcUrl?: string, privateKey?: string) => {
  if (!privateKey) {
    return new ethers.providers.JsonRpcProvider(
      rpcUrl || 'https://rpc.ankr.com/eth'
    );
  }

  const hdwallet = new HDWalletProvider(
    privateKey,
    rpcUrl || 'https://rpc.ankr.com/eth'
  );
  return new ethers.providers.Web3Provider(hdwallet);
};

export default provider;
