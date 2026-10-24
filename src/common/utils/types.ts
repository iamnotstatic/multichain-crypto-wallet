import bitcoinHelper from '../../common/helpers/bitcoinHelper';
import ethereumHelper from '../../common/helpers/ethereumHelper';
import solanaHelper from '../../common/helpers/solanaHelper';
import wavesHelper from '../../common/helpers/wavesHelper';
import tronHelper from '../../common/helpers/tronHelper';
import tonHelper from '../../common/helpers/tonHelper';

export type Network =
  | 'ethereum'
  | 'solana'
  | 'tron'
  | 'waves'
  | 'bitcoin'
  | 'bitcoin-testnet'
  | 'ton';

export type NetworkHelper<T extends Network> = {
  [key in T]:
  | typeof bitcoinHelper
  | typeof ethereumHelper
  | typeof solanaHelper
  | typeof wavesHelper
  | typeof tronHelper
  | typeof tonHelper;
};

export interface TransferPayload {
  recipientAddress: string;
  amount: number;
  network: Network;
  rpcUrl?: string;
  apiKey?: string;
  privateKey: string;
  gasPrice?: string;
  tokenAddress?: string;
  nonce?: number;
  data?: string;
  gasLimit?: number;
  fee?: number; // defaults to 10000
  feeLimit?: number;
  subtractFee?: boolean; // defaults to false
  walletVersion?: TonWalletVersion;
  forwardGas?: number | string;  // for ton jetton 
  memo?: string; // for memo tag ton
}

export interface BalancePayload {
  address: string;
  network: Network;
  rpcUrl?: string;
  apiKey?: string;
  tokenAddress?: string;
  walletVersion?: TonWalletVersion;
  privateKey?: string;
}

export interface CreateWalletPayload {
  derivationPath?: string;
  cluster?: string;
  walletVersion?: TonWalletVersion;
  network: Network;
}

export interface GetAddressFromPrivateKeyPayload {
  privateKey: string;
  network: Network;
  walletVersion?: TonWalletVersion;
}

export interface GetTransactionPayload {
  rpcUrl?: string;
  apiKey?: string;
  address?: string;
  logicalTime?: string;
  hash: string;
  network: Network;
}

export interface GenerateWalletFromMnemonicPayload {
  mnemonic: string;
  derivationPath?: string;
  cluster?: string;
  walletVersion?: TonWalletVersion;
  network: Network;
}

export interface IResponse {
  [key: string]: any;
}

export interface GetEncryptedJsonFromPrivateKey {
  password: string;
  privateKey: string;
  network: Network;
}

export interface GetWalletFromEncryptedjsonPayload {
  json: string;
  password: string;
  network: Network;
}

export interface IGetTokenInfoPayload {
  network: Network;
  rpcUrl: string;
  address: string;
  cluster?: 'mainnet-beta' | 'testnet' | 'devnet';
  apiKey?: string;
}

export interface ITokenInfo {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  totalSupply: string;
  logoUrl?: string;
}

export interface ISplTokenInfo {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  tags: string[];
  extensions: any;
}

export interface ISmartContractCallPayload {
  rpcUrl: string;
  apiKey?: string;
  network: Network;
  contractAddress: string;
  method: string;
  methodType: 'read' | 'write';
  params: any[];
  payment?: any[];
  value?: number;
  contractAbi?: any[];
  gasPrice?: string;
  gasLimit?: number;
  feeLimit?: number;
  nonce?: number;
  privateKey?: string;
}

export type TonWalletVersion = 'v4R2' | 'W5';

export interface INetworkHelper {
  getAddressFromPrivateKey: (args: GetAddressFromPrivateKeyPayload) => IResponse;
  generateWalletFromMnemonic: (args: GenerateWalletFromMnemonicPayload) => IResponse;
  createWallet: (args: CreateWalletPayload) => IResponse;
  getBalance: (args: BalancePayload) => Promise<IResponse>;
  transfer: (args: TransferPayload) => Promise<IResponse>;
  getTransaction: (args: GetTransactionPayload) => Promise<IResponse>;
  getEncryptedJsonFromPrivateKey?: (args: GetEncryptedJsonFromPrivateKey) => Promise<IResponse>;
  getWalletFromEncryptedJson?: (args: GetWalletFromEncryptedjsonPayload) => Promise<IResponse>;
  getTokenInfo?: (args: IGetTokenInfoPayload) => Promise<IResponse>;
  smartContractCall?: (args: ISmartContractCallPayload) => Promise<IResponse>;
}
