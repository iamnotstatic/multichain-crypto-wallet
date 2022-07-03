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
        'excess quit spot inspire stereo scrap cave wife narrow era pizza typical',
      derivationPath: "m/44'/0'/0'/0/0", // Leave empty to use default derivation path
      network: 'bitcoin', // 'bitcoin' or 'bitcoin-testnet'
    });

    expect(wallet.address).toBe('1NV8FPKDW1hxJFxc2dNVZDAp7iCqxCLeFu');
    expect(wallet.privateKey).toBe(
      'KxqTGtCMnX6oL9rxynDKCRJXt64Gm5ame4AEQcYncFhSSUxFBkeJ'
    );
    expect(wallet.mnemonic).toBe(
      'excess quit spot inspire stereo scrap cave wife narrow era pizza typical'
    );
  });

  it('getAddressFromPrivateKey', async () => {
    const data = await getAddressFromPrivateKey({
      privateKey: 'KxqTGtCMnX6oL9rxynDKCRJXt64Gm5ame4AEQcYncFhSSUxFBkeJ',
      network: 'bitcoin', // 'bitcoin' or 'bitcoin-testnet'
    });

    expect(data.address).toBe('1NV8FPKDW1hxJFxc2dNVZDAp7iCqxCLeFu');
  });
});
