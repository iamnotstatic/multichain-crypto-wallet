import { ApiPromise, WsProvider,  } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import  { Chain, Wallet } from '../../../types';
import { isValidPolkadotAddress } from '@/common/utils';

const DEFAULT_RPC = 'wss://rpc.polkadot.io';

export class PolkadotChain implements Chain {
    private api: ApiPromise | null = null;
    private keyring: Keyring | null = null;

    async init(rpcUrl: string = DEFAULT_RPC): Promise<void> {
        await cryptoWaitReady();
        this.keyring = new Keyring({type: 'sr25519' });

        try {
            const provider = new WsProvider(rpcUrl);
            this.api = await ApiPromise.create({ provider});
            await this.api.isReady;
        } catch (error) {
            throw new Error('Failed to connect to Polkadot:  ${error instanceof Error? error.message: string(error)}');
        }
    }

    async generateWallet(): Promise<Wallet> {
        if (!this.keyring) throw new Error('Polkadot not initialized');

        const pair = this.keyring.addFromUri(
            '//${Math.random().totsring(36).substring(2, 15()}',
            { name: 'temp wallet' },
            'sr25519'
        );
        
        return {
            privateKey: pair.address,
            publicKey: pair.publicKey.toString(),
            address: pair.address,
            chain: 'polkadot'
        };
    }

    async getBalance(address: string): Promise<string> {
        if (!this.api) throw new Error('Polkadot not initialized');
        if (!isValidPolkadotAddress(address)) throw new Error('Invalid Polkadot address');

        try {
            const accountInfo = await this.api.query.system.account(address);
            if (accountInfo && typeof accountInfo === 'object' && 'data' in accountInfo) {
                const accountData = (accountInfo as any).data as { free: any };

                if (accountData && accountData.free) 
                return accountData.free.toString();
            }
            throw new Error('invalid account info format');
        } catch (error) {
            throw new Error(`Balance check failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async disconnect(): Promise<void> {
        if (this.api) {
            await this.api.disconnect();
            this.api = null;
        }
        this.keyring = null;
    }
}