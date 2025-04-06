export type PolkadotNetwork = 'polkadot' | 'kusama' | 'westend' | 'rococo';

export interface PolkadotConfig {
    network: PolkadotNetwork;
    customerRpcUrl?: string;
    ss58Format?: number;
}

export interface PolkadotTransaction {
    to: string;
    amount: string;
    memo?: string;
    era?: number;
}