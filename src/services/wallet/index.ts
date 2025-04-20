import * as bip39 from 'bip39';

import bitcoinHelper from '../../common/helpers/bitcoinHelper';
import ethereumHelper from '../../common/helpers/ethereumHelper';
import solanaHelper from '../../common/helpers/solanaHelper';
import wavesHelper from '../../common/helpers/wavesHelper';
import tronHelper from '../../common/helpers/tronHelper';
import { ethers } from 'ethers';
import { Keypair } from '@solana/web3.js';

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
  Network,
} from '../../common/utils/types';

const networkHelpers: Record<Network, any> = {
  ethereum: ethereumHelper,
  solana: solanaHelper,
  tron: tronHelper,
  waves: wavesHelper,
  bitcoin: bitcoinHelper,
  'bitcoin-testnet': bitcoinHelper,
};

const baseFeatures = [
  'createWallet',
  'getAddressFromPrivateKey',
  'generateWalletFromMnemonic',
  'getBalance',
  'transfer',
  'getTransaction',
];

const supportedFeatures = {
  ethereum: [
    ...baseFeatures,
    'getEncryptedJsonFromPrivateKey',
    'getWalletFromEncryptedJson',
    'getTokenInfo',
    'smartContractCall',
  ],
  solana: [...baseFeatures, 'getTokenInfo'],
  bitcoin: [...baseFeatures],
  'bitcoin-testnet': [...baseFeatures],
  waves: [
    ...baseFeatures.filter(feature => feature !== 'getAddressFromPrivateKey'),
    'getTokenInfo',
    'smartContractCall',
  ],
  tron: [...baseFeatures, 'getTokenInfo', 'smartContractCall'],
};

function getNetworkHelper(network: Network) {
  const helper = networkHelpers[network];
  if (!helper) {
    throw new Error(`Unsupported network: ${network}`);
  }

  return helper;
}

function isFeatureSupported(network: Network, feature: string): boolean {
  return supportedFeatures[network]?.includes(feature) || false;
}

function generateMnemonic(numWords: number = 12): string {
  const strength = (numWords / 3) * 32;

  return bip39.generateMnemonic(strength);
}

function getAddressFromPrivateKey(args: GetAddressFromPrivateKeyPayload) {
  try {
    if (!isFeatureSupported(args.network, 'getAddressFromPrivateKey')) {
      throw new Error(
        `getAddressFromPrivateKey is not supported for ${args.network}`
      );
    }

    const helper = getNetworkHelper(args.network);

    if (!helper) {
      throw new Error('Invalid network');
    }

    return helper.getAddressFromPrivateKey(args.privateKey);
  } catch (error) {
    throw error;
  }
}

function generateWalletFromMnemonic(args: GenerateWalletFromMnemonicPayload) {
  try {
    if (!isFeatureSupported(args.network, 'generateWalletFromMnemonic')) {
      throw new Error(
        `generateWalletFromMnemonic is not supported for ${args.network}`
      );
    }

    const helper = getNetworkHelper(args.network);

    if (!helper) {
      throw new Error('Invalid network');
    }

    return helper.generateWalletFromMnemonic(
      args.mnemonic,
      args.derivationPath
    );
  } catch (error) {
    throw error;
  }
}

function createWallet(args: CreateWalletPayload) {
  try {
    if (!isFeatureSupported(args.network, 'createWallet')) {
      throw new Error(`createWallet is not supported for ${args.network}`);
    }

    const helper = getNetworkHelper(args.network);

    if (!helper) {
      throw new Error('Invalid network');
    }

    return helper.createWallet(args.derivationPath);
  } catch (error) {
    throw error;
  }
}

async function getBalance(args: BalancePayload) {
  try {
    if (!isFeatureSupported(args.network, 'getBalance')) {
      throw new Error(`getBalance is not supported for ${args.network}`);
    }

    const helper = getNetworkHelper(args.network);

    if (!helper) {
      throw new Error('Invalid network');
    }

    return helper.getBalance({ ...args });
  } catch (error) {
    throw error;
  }
}

async function transfer(args: TransferPayload) {
  try {
    if (!isFeatureSupported(args.network, 'transfer')) {
      throw new Error(`transfer is not supported for ${args.network}`);
    }

    const helper = getNetworkHelper(args.network);

    if (!helper) {
      throw new Error('Invalid network');
    }

    return helper.transfer({ ...args });
  } catch (error) {
    throw error;
  }
}

async function getTransaction(args: GetTransactionPayload) {
  try {
    if (!isFeatureSupported(args.network, 'getTransaction')) {
      throw new Error(`getTransaction is not supported for ${args.network}`);
    }

    const helper = getNetworkHelper(args.network);

    if (!helper) {
      throw new Error('Invalid network');
    }

    return helper.getTransaction({ ...args });
  } catch (error) {
    throw error;
  }
}

async function getEncryptedJsonFromPrivateKey(
  args: GetEncryptedJsonFromPrivateKey
) {
  try {
    if (!isFeatureSupported(args.network, 'getEncryptedJsonFromPrivateKey')) {
      throw new Error(
        `getEncryptedJsonFromPrivateKey is not supported for ${args.network}`
      );
    }

    const helper = getNetworkHelper(args.network);

    if (!helper) {
      throw new Error('Invalid network');
    }

    return helper.getEncryptedJsonFromPrivateKey({ ...args });
  } catch (error) {
    throw error;
  }
}

async function getWalletFromEncryptedJson(
  args: GetWalletFromEncryptedjsonPayload
) {
  try {
    if (!isFeatureSupported(args.network, 'getWalletFromEncryptedJson')) {
      throw new Error(
        `getWalletFromEncryptedJson is not supported for ${args.network}`
      );
    }

    const helper = getNetworkHelper(args.network);

    if (!helper) {
      throw new Error('Invalid network');
    }

    return helper.getWalletFromEncryptedJson({ ...args });
  } catch (error) {
    throw error;
  }
}

async function getTokenInfo(args: IGetTokenInfoPayload) {
  try {
    if (!isFeatureSupported(args.network, 'getTokenInfo')) {
      throw new Error(`getTokenInfo is not supported for ${args.network}`);
    }

    const helper = getNetworkHelper(args.network);

    if (!helper) {
      throw new Error('Invalid network');
    }

    return helper.getTokenInfo({ ...args });
  } catch (error) {
    throw error;
  }
}

async function smartContractCall(args: ISmartContractCallPayload) {
  try {
    if (!isFeatureSupported(args.network, 'smartContractCall')) {
      throw new Error(`smartContractCall is not supported for ${args.network}`);
    }

    const helper = getNetworkHelper(args.network);

    if (!helper) {
      throw new Error('Invalid network');
    }

    return helper.smartContractCall({ ...args });
  } catch (error) {
    throw error;
  }
}

export async function signMessage(
  message: string,
  privateKey: string | Uint8Array,
  chainType: Network 
): Promise<string> {
  if (!message || typeof message !== "string") {
    throw new Error("Message must be a non-empty string");
  }

  if (!privateKey) {
    throw new Error("private Key is required");
  }

  const helper = getNetworkHelper(chainType);

  if (!helper) {
    throw new Error(`Unsupported network: ${chainType}`);
  }

  try {
    switch (chainType) {
      case "ethereum":
      case "tron":
      case "waves":{
        // EVM chains
        if (typeof privateKey !== "string" || !privateKey.startsWith("0x")) {
          throw new Error("EVM private key must be a hex string (0x-prefixed)");
        }  

        const wallet = new ethers.Wallet(privateKey);
        return await wallet.signMessage(message);
      }
      
      case "solana": {
        // solana
        if (!(privateKey instanceof Uint8Array) || privateKey.length !== 64) {
          throw new Error("solana private key must be a 64-byte Uint8Array");
        } 

        const keypair = Keypair.fromSecretKey(privateKey);
        const encodedMessage = new TextEncoder().encode(message);
        const nacl = await import("tweetnacl");
        const signature = nacl.sign.detached(encodedMessage, keypair.secretKey);
        return Buffer.from(signature).toString("base64");
      }

      case "bitcoin":
      case "bitcoin-testnet": {
        // Bitcoin
        if (typeof helper.signMessage !== "function") {
          throw new Error(`signMessage is not supported for ${chainType}`);
        }

        return helper.signMessage(message, privateKey);
      } 

      default:
        throw new Error(`Unsupported chain type: ${chainType}`);
    }
  } catch (error) {
    throw new Error(`Signing failed: ${error.message}`);
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
