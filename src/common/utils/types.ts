export interface TransferPayload {
  toAddress: string;
  amount: number;
  network: string;
  rpcUrl: string;
  privateKey: string;
  gasPrice?: string;
  tokenAddress?: string;
}
