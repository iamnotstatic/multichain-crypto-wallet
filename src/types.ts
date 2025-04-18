export type ChainType = 'polkadot' | 'ethereum' | 'solana' | 'bitcoin' | 'tron';

export interface Chain {
    init(rpcUrl?: string): Promise<void>;
    generateWallet(): Promise<Wallet>;
    getBalance(address: string): Promise<string>;
    disconnect(): Promise<void>;
}

export interface Wallet {
    privateKey: string;
    publicKey?: string;
    address?: string;
    chain: string;
}