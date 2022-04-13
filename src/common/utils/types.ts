export interface TransferPayload {
  toAddress: string;
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
  privateKey?: string;
  tokenAddress?: string;
}

export interface CreateWalletPayload {
  network: string;
}
