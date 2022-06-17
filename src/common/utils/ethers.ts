import { ethers } from 'ethers';

const provider = (rpcUrl?: string) => {
  return new ethers.providers.JsonRpcProvider(rpcUrl);
};

export default provider;
