import {
  generateMnemonic,
  createWallet,
  generateWalletFromMnemonic,
  getAddressFromPrivateKey,
  getBalance,
  transfer,
  getTransaction,
} from '../src';

describe('MultichainCryptoWallet Bitcoin tests', () => {
  it('generateMnemonic', () => {
    const mnemonic = generateMnemonic(); // default is 12

    expect(typeof mnemonic).toBe('string');
  });

  it('createWallet', () => {
    const wallet = createWallet({
      derivationPath: "m/44'/0'/0'/0/0", // Leave empty to use default derivation path
      network: 'bitcoin', // 'bitcoin' or 'bitcoin-testnet'
    });

    expect(typeof wallet).toBe('object');
  });

  it('generateWalletFromMnemonic', () => {
    const wallet = generateWalletFromMnemonic({
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

  it('getAddressFromPrivateKey', () => {
    const data = getAddressFromPrivateKey({
      privateKey: 'KxqTGtCMnX6oL9rxynDKCRJXt64Gm5ame4AEQcYncFhSSUxFBkeJ',
      network: 'bitcoin', // 'bitcoin' or 'bitcoin-testnet'
    });

    expect(data.address).toBe('1NV8FPKDW1hxJFxc2dNVZDAp7iCqxCLeFu');
  });

  it('getBalance', async () => {
    const data = await getBalance({
      address: 'bc1q7yh99tgvqnpuzgja4etahdgznxldwu3flrf2fl',
      network: 'bitcoin', // 'bitcoin' or 'bitcoin-testnet'
    });

    expect(typeof data.balance).toBe('number');
  });

  it('Get transaction', async () => {
    const receipt = await getTransaction({
      network: 'bitcoin', // 'bitcoin' or 'bitcoin-testnet'
      hash: 'e499940336c523ed7bb6dce45f3e6fc9a68442cb814ca2f84c2c0c1cdca37c6d',
    });

    expect(typeof receipt).toBe('object');
  });

  it('Transfer', async () => {
    const response = await transfer({
      privateKey: 'L3tSvMViDit1GSp7mbV2xFCGv6M45kDNuSyNY9xyUxmUPBFrBkc4',
      recipientAddress: '2NAhbS79dEUeqcnbC27UppwnjoVSwET5bat',
      amount: 0.0000001,
      network: 'bitcoin-testnet', // 'bitcoin' or 'bitcoin-testnet'
      fee: 10000, // Optional param default value is 10000
      subtractFee: false, // Optional param default value is false
    });

    expect(typeof response).toBe('object');
  });
});
