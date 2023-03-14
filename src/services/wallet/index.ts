import * as bip39 from 'bip39';

import bitcoinHelper from '../../common/helpers/bitcoinHelper';
import ethereumHelper from '../../common/helpers/ethereumHelper';
import solanaHelper from '../../common/helpers/solanaHelper';
import wavesHelper from '../../common/helpers/wavesHelper';

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

function generateMnemonic(numWords: number = 12): string {
  const strength = (numWords / 3) * 32;

  return bip39.generateMnemonic(strength);
}
function getAddressFromPrivateKey(args: GetAddressFromPrivateKeyPayload) {
  try {
    if (args.network === 'ethereum') {
      return ethereumHelper.getAddressFromPrivateKey(args.privateKey);
    } else if (args.network === 'solana') {
      return solanaHelper.getAddressFromPrivateKey(args.privateKey);
    } else if (args.network.includes('bitcoin')) {
      return bitcoinHelper.getAddressFromPrivateKey(
        args.privateKey,
        args.network
      );
    }

    throw new Error('Invalid network');
  } catch (error) {
    throw error;
  }
}

function generateWalletFromMnemonic(args: GenerateWalletFromMnemonicPayload) {
  try {
    if (args.network === 'ethereum') {
      return ethereumHelper.generateWalletFromMnemonic(
        args.mnemonic,
        args.derivationPath
      );
    } else if (args.network === 'solana') {
      return solanaHelper.generateWalletFromMnemonic(
        args.mnemonic,
        args.derivationPath
      );
    } else if (args.network.includes('bitcoin')) {
      return bitcoinHelper.generateWalletFromMnemonic(
        args.network,
        args.mnemonic,
        args.derivationPath
      );
    } else if (args.network === 'waves') {
      return wavesHelper.generateWalletFromMnemonic(
        args.mnemonic,
        args.cluster
      );
    }

    throw new Error('Invalid network');
  } catch (error) {
    throw error;
  }
}

function createWallet(args: CreateWalletPayload) {
  try {
    if (args.network === 'ethereum') {
      return ethereumHelper.createWallet(args.derivationPath);
    } else if (args.network === 'solana') {
      return solanaHelper.createWallet(args.derivationPath);
    } else if (args.network.includes('bitcoin')) {
      return bitcoinHelper.createWallet(args.network, args.derivationPath);
    } else if (args.network === 'waves') {
      return wavesHelper.createWallet(args.cluster);
    }

    throw new Error('Invalid network');
  } catch (error) {
    throw error;
  }
}
async function getBalance(args: BalancePayload) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.getBalance({ ...args });
    } else if (args.network === 'solana') {
      return await solanaHelper.getBalance({ ...args });
    } else if (args.network.includes('bitcoin')) {
      return await bitcoinHelper.getBalance(args.address, args.network);
    } else if (args.network === 'waves') {
      return await wavesHelper.getBalance({ ...args });
    }

    throw new Error('Invalid network');
  } catch (error) {
    throw error;
  }
}

async function transfer(args: TransferPayload) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.transfer({ ...args });
    } else if (args.network === 'solana') {
      return await solanaHelper.transfer({ ...args });
    } else if (args.network.includes('bitcoin')) {
      return await bitcoinHelper.transfer({ ...args });
    } else if (args.network === 'waves') {
      return await wavesHelper.transfer({ ...args });
    }

    throw new Error('Invalid network');
  } catch (error) {
    throw error;
  }
}

async function getTransaction(args: GetTransactionPayload) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.getTransaction({ ...args });
    } else if (args.network === 'solana') {
      return await solanaHelper.getTransaction({ ...args });
    } else if (args.network.includes('bitcoin')) {
      return await bitcoinHelper.getTransaction({ ...args });
    } else if (args.network === 'waves') {
      return await wavesHelper.getTransaction({ ...args });
    }

    throw new Error('Invalid network');
  } catch (error) {
    throw error;
  }
}

async function getEncryptedJsonFromPrivateKey(
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

async function getWalletFromEncryptedJson(
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

async function getTokenInfo(args: IGetTokenInfoPayload) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.getTokenInfo({ ...args });
    } else if (args.network === 'solana') {
      return solanaHelper.getTokenInfo({ ...args });
    } else if (args.network === 'waves') {
      return wavesHelper.getTokenInfo({ ...args });
    }

    throw new Error('Invalid network');
  } catch (error) {
    throw error;
  }
}

async function smartContractCall(args: ISmartContractCallPayload) {
  try {
    if (args.network === 'ethereum') {
      return await ethereumHelper.smartContractCall({ ...args });
    } else if (args.network === 'waves') {
      return await wavesHelper.smartContractCall({ ...args });
    } else {
      throw new Error('Only Ethereum and Waves is supported at this time');
    }
  } catch (error) {
    throw error;
  }
}

export {
  generateMnemonic,
  getAddressFromPrivateKey,
  generateWalletFromMnemonic,
  createWallet,
  getBalance,
  transfer,
  getTransaction,
  getEncryptedJsonFromPrivateKey,
  getWalletFromEncryptedJson,
  getTokenInfo,
  smartContractCall,
};
