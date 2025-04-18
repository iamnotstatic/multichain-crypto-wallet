export * from './services/wallet';
export type ChainType = 'evm' | 'solana' | 'polkadot';

export interface Wallet {
    privateKey: string;
    publicKey?: string;
    address?: string;
    chain: ChainType
}

export interface Chain {
    init(rpcUrl?: string): Promise<void>;
    generateWallet(): Promise<Wallet>;
    getbalance(addres: string): Promise<string>;
    disconnect(): Promise<void>;
}
