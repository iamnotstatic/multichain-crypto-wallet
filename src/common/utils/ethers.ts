import { ethers } from 'ethers';
import HDWalletProvider from '@truffle/hdwallet-provider';

const provider = (rpcUrl: string, privateKey?: string) => {
  if (!privateKey) {
    return new ethers.providers.JsonRpcProvider(
      rpcUrl
    );
  }

  const hdwallet = new HDWalletProvider(
    privateKey,
    rpcUrl
  );
  return new ethers.providers.Web3Provider(hdwallet);
};

export default provider;
