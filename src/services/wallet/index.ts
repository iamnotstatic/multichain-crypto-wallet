import {
  getBalance,
  createEthereumWallet,
  transfer,
  getAddressFromPrivateKey,
} from '../../common/helpers/ethersHelper';
import {
  getSolBalance,
  createSolanaWallet,
  transferSol,
  getSolAddressFromPrivateKey,
} from '../../common/helpers/solanaHelper';

import {
  TransferPayload,
  BalancePayload,
  CreateWalletPayload,
  GetAddressFromPrivateKeyPayload,
} from '../../common/utils/types';

export default class Wallet {
  async getBalance(args: BalancePayload) {
    try {
      if (args.network === 'ethereum') {
        return await getBalance({ ...args });
      } else if (args.network === 'solana') {
        return await getSolBalance({ ...args });
      }

      return;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getAddressFromPrivateKey(args: GetAddressFromPrivateKeyPayload) {
    try {
      if (args.network === 'ethereum') {
        return await getAddressFromPrivateKey(args);
      } else if (args.network === 'solana') {
        return await getSolAddressFromPrivateKey(args);
      }

      return;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async createWallet(args: CreateWalletPayload) {
    try {
      if (args.network === 'ethereum') {
        return await createEthereumWallet();
      } else if (args.network === 'solana') {
        return await createSolanaWallet();
      }

      return;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async transfer(args: TransferPayload) {
    try {
      if (args.network === 'ethereum') {
        return await transfer({ ...args });
      } else if (args.network === 'solana') {
        return await transferSol({ ...args });
      }

      return;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
