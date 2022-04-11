import { getBalance } from '../../common/helpers/contractHelper';
import { getSolBalance } from '../../common/helpers/solanaHelper';

export default class Wallet {
  async getBalance(
    address: string,
    network: string,
    rpcUrl: string,
    privateKey?: string,
    tokenAddress?: string
  ) {
    try {
      if (network === 'ethereum') {
        return await getBalance(rpcUrl, address, privateKey, tokenAddress);
      } else if (network === 'solana') {
        return await getSolBalance(rpcUrl, address);
      }
  
      return;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
