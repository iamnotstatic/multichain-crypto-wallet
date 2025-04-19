import * as bip39 from 'bip39';

import bitcoinHelper from '../../common/helpers/bitcoinHelper';
import ethereumHelper from '../../common/helpers/ethereumHelper';
import solanaHelper from '../../common/helpers/solanaHelper';
import wavesHelper from '../../common/helpers/wavesHelper';
import tronHelper from '../../common/helpers/tronHelper';

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
  INetworkHelper,
} from '../../common/utils/types';

/**
 * Mapping of supported networks to their corresponding helper implementations.
 */
const networkHelpers: Record<Network, INetworkHelper> = {
  ethereum: ethereumHelper,
  solana: solanaHelper,
  tron: tronHelper,
  waves: wavesHelper,
  bitcoin: bitcoinHelper,
  'bitcoin-testnet': bitcoinHelper,
};

/**
 * Core features available for all networks.
 */
const baseFeatures = [
  'createWallet',
  'getAddressFromPrivateKey',
  'generateWalletFromMnemonic',
  'getBalance',
  'transfer',
  'getTransaction',
];

/**
 * Feature support matrix for each network.
 */
const supportedFeatures: Record<Network, string[]> = {
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
  waves: [...baseFeatures, 'getTokenInfo', 'smartContractCall'],
  tron: [...baseFeatures, 'getTokenInfo', 'smartContractCall'],
};

/**
 * Retrieves the helper for the specified network or throws if unsupported.
 *
 * @param network - The blockchain network identifier.
 * @returns The network helper implementation.
 * @throws {Error} When an unsupported network is provided.
 */
function getNetworkHelper(network: Network): INetworkHelper {
  const helper = networkHelpers[network];
  if (!helper) {
    throw new Error(`Unsupported network: ${network}`);
  }
  return helper;
}

/**
 * Checks if a given feature is supported on the specified network.
 *
 * @param network - The blockchain network identifier.
 * @param feature - The feature to check support for.
 * @returns True if supported; otherwise, false.
 */
function isFeatureSupported(network: Network, feature: string): boolean {
  return supportedFeatures[network]?.includes(feature) || false;
}

/**
 * Generates a mnemonic phrase.
 *
 * @param numWords - The number of words in the mnemonic (default is 12).
 * @returns A mnemonic phrase as a string.
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
 * @throws {Error} When an unsupported or invalid network is provided.
 * @remarks Supported networks: Ethereum, Solana, and Bitcoin variants.
 */
function getAddressFromPrivateKey(
  args: GetAddressFromPrivateKeyPayload
) {
  if (!isFeatureSupported(args.network, 'getAddressFromPrivateKey')) {
    throw new Error(
      `getAddressFromPrivateKey is not supported for ${args.network}`
    );
  }
  const helper = getNetworkHelper(args.network);
  return helper.getAddressFromPrivateKey(args);
}

/**
 * Generates a wallet from a mnemonic phrase.
 *
 * @param args - The payload containing the mnemonic, derivation path, and network details.
 * @returns A wallet object generated from the provided mnemonic.
 * @throws {Error} When an unsupported or invalid network is provided.
 * @remarks Supported networks: Ethereum, Solana, Bitcoin variants, and Waves.
 */
function generateWalletFromMnemonic(
  args: GenerateWalletFromMnemonicPayload
) {
  if (!isFeatureSupported(args.network, 'generateWalletFromMnemonic')) {
    throw new Error(
      `generateWalletFromMnemonic is not supported for ${args.network}`
    );
  }
  const helper = getNetworkHelper(args.network);
  return helper.generateWalletFromMnemonic(args);
}

/**
 * Creates a new wallet for the specified network.
 *
 * @param args - The payload containing network information and configuration parameters
 *               (such as derivation path or cluster details).
 * @returns The newly created wallet.
 * @throws {Error} When an unsupported or invalid network is provided.
 * @remarks Supported networks: Ethereum, Solana, Bitcoin variants, and Waves.
 */
function createWallet(args: CreateWalletPayload) {
  if (!isFeatureSupported(args.network, 'createWallet')) {
    throw new Error(`createWallet is not supported for ${args.network}`);
  }
  const helper = getNetworkHelper(args.network);
  return helper.createWallet(args);
}

/**
 * Retrieves the balance for a given address or wallet.
 *
 * @param args - The payload containing the address and network information.
 * @returns The balance of the specified address or wallet.
 * @throws {Error} When an unsupported or invalid network is provided.
 * @remarks Supported networks: Ethereum, Solana, Bitcoin variants, and Waves.
 */
async function getBalance(args: BalancePayload) {
  if (!isFeatureSupported(args.network, 'getBalance')) {
    throw new Error(`getBalance is not supported for ${args.network}`);
  }
  const helper = getNetworkHelper(args.network);
  return helper.getBalance(args);
}

/**
 * Executes a transfer transaction on the specified network.
 *
 * @param args - The payload containing transfer details, including sender, recipient, amount, and network.
 * @returns The result of the transfer operation.
 * @throws {Error} When an unsupported or invalid network is provided.
 * @remarks Supported networks: Ethereum, Solana, Bitcoin variants, and Waves.
 */
async function transfer(args: TransferPayload) {
  if (!isFeatureSupported(args.network, 'transfer')) {
    throw new Error(`transfer is not supported for ${args.network}`);
  }
  const helper = getNetworkHelper(args.network);
  return helper.transfer(args);
}

/**
 * Retrieves details of a specific transaction.
 *
 * @param args - The payload containing transaction identification and network details.
 * @returns The transaction details.
 * @throws {Error} When an unsupported or invalid network is provided.
 * @remarks Supported networks: Ethereum, Solana, Bitcoin variants, and Waves.
 */
async function getTransaction(args: GetTransactionPayload) {
  if (!isFeatureSupported(args.network, 'getTransaction')) {
    throw new Error(`getTransaction is not supported for ${args.network}`);
  }
  const helper = getNetworkHelper(args.network);
  return helper.getTransaction(args);
}

/**
 * Generates an encrypted JSON wallet from a private key for Ethereum.
 *
 * @param args - The payload containing the private key and network information.
 * @returns A promise that resolves to the encrypted JSON wallet.
 * @throws {Error} When an unsupported or invalid network is provided.
 * @remarks Currently, only the Ethereum network is supported.
 */
async function getEncryptedJsonFromPrivateKey(
  args: GetEncryptedJsonFromPrivateKey
) {
  if (!isFeatureSupported(args.network, 'getEncryptedJsonFromPrivateKey')) {
    throw new Error(
      `getEncryptedJsonFromPrivateKey is not supported for ${args.network}`
    );
  }
  const helper = getNetworkHelper(args.network);
  return helper.getEncryptedJsonFromPrivateKey?.(args);
}

/**
 * Retrieves a wallet from its encrypted JSON representation for Ethereum.
 *
 * @param args - The payload containing the encrypted JSON and network details.
 * @returns A promise that resolves to the decrypted wallet.
 * @throws {Error} When an unsupported or invalid network is provided.
 * @remarks Currently, only the Ethereum network is supported.
 */
async function getWalletFromEncryptedJson(
  args: GetWalletFromEncryptedjsonPayload
) {
  if (!isFeatureSupported(args.network, 'getWalletFromEncryptedJson')) {
    throw new Error(
      `getWalletFromEncryptedJson is not supported for ${args.network}`
    );
  }
  const helper = getNetworkHelper(args.network);
  return helper.getWalletFromEncryptedJson?.(args);
}

/**
 * Fetches token information from the specified network.
 *
 * @param args - The payload containing token and network details.
 * @returns The token information.
 * @throws {Error} When an unsupported or invalid network is provided.
 * @remarks Supported networks: Ethereum, Solana, and Waves.
 */
async function getTokenInfo(args: IGetTokenInfoPayload) {
  if (!isFeatureSupported(args.network, 'getTokenInfo')) {
    throw new Error(`getTokenInfo is not supported for ${args.network}`);
  }
  const helper = getNetworkHelper(args.network);
  return helper.getTokenInfo?.(args);
}

/**
 * Executes a smart contract call on the specified network.
 *
 * @param args - The payload containing smart contract call details and network information.
 * @returns The result of the smart contract call.
 * @throws {Error} When an unsupported or invalid network is provided, or if the network is not Ethereum or Waves.
 * @remarks Currently, only Ethereum and Waves networks are supported.
 */
async function smartContractCall(args: ISmartContractCallPayload) {
  if (!isFeatureSupported(args.network, 'smartContractCall')) {
    throw new Error(`smartContractCall is not supported for ${args.network}`);
  }
  const helper = getNetworkHelper(args.network);
  return helper.smartContractCall?.(args);
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
