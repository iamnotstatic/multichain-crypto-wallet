import {
  getBalance,
  createEthereumWallet,
  transfer,
} from '../../common/helpers/ethersHelper';
import {
  getSolBalance,
  createSolanaWallet,
  transferSol,
} from '../../common/helpers/solanaHelper';

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

  async createWallet(network: string) {
    try {
      if (network === 'ethereum') {
        return await createEthereumWallet();
      } else if (network === 'solana') {
        return await createSolanaWallet();
      }

      return;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async transfer(
    toAddress: string,
    amount: number,
    network: string,
    rpcUrl: string,
    privateKey: string,
    tokenAddress?: string
  ) {
    try {
      if (network === 'ethereum') {
        return await transfer(
          rpcUrl,
          privateKey,
          toAddress,
          amount,
          tokenAddress
        );
      } else if (network === 'solana') {
        return await transferSol(rpcUrl, privateKey, toAddress, amount);
      }

      return;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
