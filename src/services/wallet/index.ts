import ethereumHelper from '../../common/helpers/ethersHelper';
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
  IGetTokenMetadataPayload,
} from '../../common/utils/types';

export async function getBalance(args: BalancePayload) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.getBalance({ ...args });
    } else if (args.network === 'solana') {
      return await solanaHelper.getBalance({ ...args });
    }

    return;
  } catch (error) {
    throw error;
  }
}

export async function getAddressFromPrivateKey(
  args: GetAddressFromPrivateKeyPayload
) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.getAddressFromPrivateKey(args);
    } else if (args.network === 'solana') {
      return await solanaHelper.getAddressFromPrivateKey(args);
    }

    return;
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
    }

    return;
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
    }

    return;
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
    }

    return;
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
    }

    return;
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

    return;
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

    return;
  } catch (error) {
    throw error;
  }
}

export async function getTokenMetadata(args: IGetTokenMetadataPayload) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.getTokenMetadata({ ...args });
    } else if (args.network === 'solana') {
      return solanaHelper.getTokenMetadata({ ...args });
    }
    return;
  } catch (error) {
    throw error;
  }
}
