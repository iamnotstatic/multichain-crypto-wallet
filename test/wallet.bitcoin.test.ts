import {
  createWallet,
  generateWalletFromMnemonic,
  getAddressFromPrivateKey,
} from '../src';

describe('MultichainCryptoWallet Bitcoin tests', () => {
  it('createWallet', async () => {
    const wallet = await createWallet({
      derivationPath: "m/44'/0'/0'/0/0", // Leave empty to use default derivation path
      network: 'bitcoin', // 'bitcoin' or 'bitcoin-testnet'
    });

    expect(typeof wallet).toBe('object');
  });

  it('generateWalletFromMnemonic', async () => {
    const wallet = await generateWalletFromMnemonic({
      mnemonic:
        'base dry mango subject neither labor portion weekend range couple right document',
      derivationPath: "m/44'/0'/0'/0/0", // Leave empty to use default derivation path
      network: 'bitcoin', // 'bitcoin' or 'bitcoin-testnet'
    });

    expect(typeof wallet).toBe('object');
  });

  it('getAddressFromPrivateKey', async () => {
    const data = await getAddressFromPrivateKey({
      privateKey:
        'L4gDoFUt4eJg7aK9nA3dop7xneeHUWA9wMFrWh7mEeV998YHCEio',
      network: 'bitcoin', // 'bitcoin' or 'bitcoin-testnet'
    });

    expect(data.address).toBe('3FvEGh9oB3i7GjhVUu4QpqgTKgPvLMCq5z');
  });
});
