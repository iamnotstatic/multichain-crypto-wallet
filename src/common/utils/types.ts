export interface TransferPayload {
  recipientAddress: string;
  amount: number;
  network: string;
  rpcUrl: string;
  privateKey: string;
  gasPrice?: string;
  tokenAddress?: string;
  nonce?: number;
}

export interface BalancePayload {
  address: string;
  network: string;
  rpcUrl: string;
  tokenAddress?: string;
}

export interface CreateWalletPayload {
  network: string;
}

export interface GetAddressFromPrivateKeyPayload {
  privateKey: string;
  network: string;
}

export interface GenerateWalletFromMnemonicPayload {
  mnemonic: string;
  network: string;
}

export interface IResponse {
  [key: string]: any;
}
