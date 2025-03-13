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

/**
 * Generates a mnemonic phrase.
 *
 * @param numWords - The number of words in the mnemonic (default is 12).
 * @returns A mnemonic phrase as a string.
 *
 * @remarks The strength is calculated as (numWords / 3) * 32.
 */
function generateMnemonic(numWords: number = 12): string {
  const strength = (numWords / 3) * 32;
  return bip39.generateMnemonic(strength);
}

/**
 * Retrieves the blockchain address from a private key.
 *
 * @param args - The payload containing the private key and network information.
 * @returns The derived blockchain address.
 *
 * @throws {Error} When an unsupported or invalid network is provided.
 *
 * @remarks Supported networks: Ethereum, Solana, and Bitcoin variants.
 */
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

/**
 * Generates a wallet from a mnemonic phrase.
 *
 * @param args - The payload containing the mnemonic, derivation path, and network details.
 * @returns A wallet object generated from the provided mnemonic.
 *
 * @throws {Error} When an unsupported or invalid network is provided.
 *
 * @remarks Supported networks: Ethereum, Solana, Bitcoin variants, and Waves.
 */
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

/**
 * Creates a new wallet for the specified network.
 *
 * @param args - The payload containing network information and configuration parameters
 *               (such as derivation path or cluster details).
 * @returns The newly created wallet.
 *
 * @throws {Error} When an unsupported or invalid network is provided.
 *
 * @remarks Supported networks: Ethereum, Solana, Bitcoin variants, and Waves.
 */
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

/**
 * Retrieves the balance for a given address or wallet.
 *
 * @param args - The payload containing the address and network information.
 * @returns The balance of the specified address or wallet.
 *
 * @throws {Error} When an unsupported or invalid network is provided.
 *
 * @remarks Supported networks: Ethereum, Solana, Bitcoin variants, and Waves.
 */
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

/**
 * Executes a transfer transaction on the specified network.
 *
 * @param args - The payload containing transfer details, including sender, recipient, amount, and network.
 * @returns The result of the transfer operation.
 *
 * @throws {Error} When an unsupported or invalid network is provided.
 *
 * @remarks Supported networks: Ethereum, Solana, Bitcoin variants, and Waves.
 */
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

/**
 * Retrieves details of a specific transaction.
 *
 * @param args - The payload containing transaction identification and network details.
 * @returns The transaction details.
 *
 * @throws {Error} When an unsupported or invalid network is provided.
 *
 * @remarks Supported networks: Ethereum, Solana, Bitcoin variants, and Waves.
 */
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

/**
 * Generates an encrypted JSON wallet from a private key for Ethereum.
 *
 * @param args - The payload containing the private key and network information.
 * @returns A promise that resolves to the encrypted JSON wallet.
 *
 * @throws {Error} When an unsupported or invalid network is provided.
 *
 * @remarks Currently, only the Ethereum network is supported.
 */
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

/**
 * Retrieves a wallet from its encrypted JSON representation for Ethereum.
 *
 * @param args - The payload containing the encrypted JSON and network details.
 * @returns A promise that resolves to the decrypted wallet.
 *
 * @throws {Error} When an unsupported or invalid network is provided.
 *
 * @remarks Currently, only the Ethereum network is supported.
 */
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

/**
 * Fetches token information from the specified network.
 *
 * @param args - The payload containing token and network details.
 * @returns The token information.
 *
 * @throws {Error} When an unsupported or invalid network is provided.
 *
 * @remarks Supported networks: Ethereum, Solana, and Waves.
 */
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

/**
 * Executes a smart contract call on the specified network.
 *
 * @param args - The payload containing smart contract call details and network information.
 * @returns The result of the smart contract call.
 *
 * @throws {Error} When an unsupported or invalid network is provided, or if the network is not Ethereum or Waves.
 *
 * @remarks Currently, only Ethereum and Waves networks are supported.
 */
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
