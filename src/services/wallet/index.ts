import bitcoinHelper from '../../common/helpers/bitcoinHelper';
import ethereumHelper from '../../common/helpers/ethereumHelper';
import solanaHelper from '../../common/helpers/solanaHelper';

import {
  TransferPayload,
  BalancePayload,
  CreateWalletPayload,
  GetAddressFromPrivateKeyPayload,
  GenerateWalletFromMnemonicPayload,
  GetTransactionPayload,
  GetWalletFromEncryptedjsonPayload,
  GetEncryptedJsonFromPrivateKey,
  IGetTokenInfoPayload,
  ISmartContractCallPayload,
} from '../../common/utils/types';

export async function getBalance(args: BalancePayload) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.getBalance({ ...args });
    } else if (args.network === 'solana') {
      return await solanaHelper.getBalance({ ...args });
    } else if (args.network.includes('bitcoin')) {
      return await bitcoinHelper.getBalance(args.address, args.network);
    }

    throw new Error('Invalid network');
  } catch (error) {
    throw error;
  }
}

export async function getAddressFromPrivateKey(
  args: GetAddressFromPrivateKeyPayload
) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.getAddressFromPrivateKey(args.privateKey);
    } else if (args.network === 'solana') {
      return await solanaHelper.getAddressFromPrivateKey(args.privateKey);
    } else if (args.network.includes('bitcoin')) {
      return await bitcoinHelper.getAddressFromPrivateKey(
        args.privateKey,
        args.network
      );
    }

    throw new Error('Invalid network');
  } catch (error) {
    throw error;
  }
}

export async function generateWalletFromMnemonic(
  args: GenerateWalletFromMnemonicPayload
) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.generateWalletFromMnemonic(
        args.mnemonic,
        args.derivationPath
      );
    } else if (args.network === 'solana') {
      return await solanaHelper.generateWalletFromMnemonic(
        args.mnemonic,
        args.derivationPath
      );
    } else if (args.network.includes('bitcoin')) {
      return await bitcoinHelper.generateWalletFromMnemonic(
        args.network,
        args.mnemonic,
        args.derivationPath
      );
    }

    throw new Error('Invalid network');
  } catch (error) {
    throw error;
  }
}

export async function createWallet(args: CreateWalletPayload) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.createWallet(args.derivationPath);
    } else if (args.network === 'solana') {
      return await solanaHelper.createWallet(args.derivationPath);
    } else if (args.network.includes('bitcoin')) {
      return await bitcoinHelper.createWallet(
        args.network,
        args.derivationPath
      );
    }

    throw new Error('Invalid network');
  } catch (error) {
    throw error;
  }
}

export async function transfer(args: TransferPayload) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.transfer({ ...args });
    } else if (args.network === 'solana') {
      return await solanaHelper.transfer({ ...args });
    } else if (args.network.includes('bitcoin')) {
      return await bitcoinHelper.transfer({ ...args });
    }

    throw new Error('Invalid network');
  } catch (error) {
    throw error;
  }
}

export async function getTransaction(args: GetTransactionPayload) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.getTransaction({ ...args });
    } else if (args.network === 'solana') {
      return await solanaHelper.getTransaction({ ...args });
    } else if (args.network.includes('bitcoin')) {
      return await bitcoinHelper.getTransaction({ ...args });
    }

    throw new Error('Invalid network');
  } catch (error) {
    throw error;
  }
}

export async function getEncryptedJsonFromPrivateKey(
  args: GetEncryptedJsonFromPrivateKey
) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.getEncryptedJsonFromPrivateKey({ ...args });
    }

    throw new Error('Invalid network');
  } catch (error) {
    throw error;
  }
}

export async function getWalletFromEncryptedJson(
  args: GetWalletFromEncryptedjsonPayload
) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.getWalletFromEncryptedJson({ ...args });
    }

    throw new Error('Invalid network');
  } catch (error) {
    throw error;
  }
}

export async function getTokenInfo(args: IGetTokenInfoPayload) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.getTokenInfo({ ...args });
    } else if (args.network === 'solana') {
      return solanaHelper.getTokenInfo({ ...args });
    }
    throw new Error('Invalid network');
  } catch (error) {
    throw error;
  }
}

export async function smartContractCall(args: ISmartContractCallPayload) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.smartContractCall({ ...args });
    } else {
      throw new Error('Only Ethereum is supported at this time');
    }
  } catch (error) {
    throw error;
  }
}
