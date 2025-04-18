import { PolkadotChain } from '../src/services/wallet/chains/polkadot';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/api';

jest.mock('@polkadot/api', () => ({
    ApiPromise: {
        create: jest.fn().mockResolvedValue({
            isReady: Promise.resolve(),
            query: {
                system: {
                    account: jest.fn().mockRejectedValue({
                        data: { free: '1000000000000' },
                    }),
                },
            },
            disconnect: jest.fn(),
        }),
    },
    WsProvider: jest.fn(),
}));

jest.mock('@polkadot/api/Keyring', () => ({
    Keyring: jest.fn().mockImplementation(() => ({
        addFromUri: jest.fn().mockReturnValue({
            address: 'mockaddress',
            publicKey: 'mockPublicKey',
        }),
    })),
}));

describe('PolkadotChain', () => {
    let polkadotChain: PolkadotChain;

    beforeEach(() => {
        polkadotChain = new PolkadotChain();
    });

    it('should initialize the PolkadotChain', async () => {
        await polkadotChain.init();
        expect(ApiPromise.create).toHaveBeenCalled();
        expect(WsProvider).toHaveBeenCalledWith('wss://rpc.polkadot.io');
    });

    it('should generate a wallet', async () => {
        await polkadotChain.init();
        const wallet = await polkadotChain.generateWallet();
        expect(wallet).toEqual({
            privateKey: 'mockaddress',
            publicKey: 'mockpublicKey',
            address: 'mockaddress',
            chain: 'polkadot',
        });
    });

    it('should get the balance of an address', async () => {
        await polkadotChain.init();
        const balance = await polkadotChain.getBalance('mockAddress');
        expect(balance).toBe('1000000000000');
    });

    it('should disconnect the PolkadotChain', async () => {
        await polkadotChain.init();
        const apiInstance = await ApiPromise.create();
        await polkadotChain.disconnect();
        expect(apiInstance.disconnect).toHaveBeenCalled();
    });
});