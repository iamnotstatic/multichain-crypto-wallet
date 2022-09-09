import {
  createWallet,
  generateWalletFromMnemonic,
  getAddressFromPrivateKey,
  getBalance,
  transfer,
  getTransaction,
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

  it('getBalance', async () => {
    const data = await getBalance({
      address: '2NAhbS79dEUeqcnbC27UppwnjoVSwET5bat',
      network: 'bitcoin-testnet', // 'bitcoin' or 'bitcoin-testnet'
    });

    expect(typeof data.balance).toBe('number');
  });

  it('Transfer', async () => {
    const response = await transfer({
      privateKey: 'L3tSvMViDit1GSp7mbV2xFCGv6M45kDNuSyNY9xyUxmUPBFrBkc4',
      recipientAddress: '2NAhbS79dEUeqcnbC27UppwnjoVSwET5bat',
      amount: 0.0001,
      network: 'bitcoin-testnet', // 'bitcoin' or 'bitcoin-testnet'
      fee: 10000, // Optional param default value is 10000
      subtractFee: false, // Optional param default value is false
    });

    expect(typeof response).toBe('object');
  });

  it('Get transaction', async () => {
    const receipt = await getTransaction({
      network: 'bitcoin-testnet', // 'bitcoin' or 'bitcoin-testnet'
      hash: '4f6c3661e0e6d190dbdfb6c0791396fccee653c5bf4a5249b049341c2b539ee1',
    });

    expect(typeof receipt).toBe('object');
  });
});
