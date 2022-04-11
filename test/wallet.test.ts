import MultichainCryptoWallet from '../src/index';

describe('MultichainCryptoWallet', () => {
  const multichainCryptoWallet = new MultichainCryptoWallet();

  jest.setTimeout(300000000);

  it('instantiate SDK', () => {
    expect(multichainCryptoWallet).toBeTruthy();
  });

  it('getBalance ETH', async () => {
    const balance = await multichainCryptoWallet.Wallet.getBalance(
      '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
      'ethereum',
      'https://rpc.ankr.com/eth'
    );

    expect(balance).toBe('0.0');
  });

  it('getBalance SOLANA', async () => {
    const balance = await multichainCryptoWallet.Wallet.getBalance(
      '5PwN5k7hin2XxUUaXveur7jSe5qt2mkWinp1JEiv8xYu',
      'solana',
      'https://rpc.ankr.com/solana'
    );

    expect(balance).toBe(0);
  });

  it('createWallet ETH', async () => {
    const wallet = await multichainCryptoWallet.Wallet.createWallet('ethereum');

    expect(typeof wallet).toBe('object');
  });

  it('createWallet SOLANA', async () => {
    const wallet = await multichainCryptoWallet.Wallet.createWallet('solana');

    expect(typeof wallet).toBe('object');
  });

  // it('transfer ETH', async () => {
  //   const payload = {
  //     toAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
  //     amount: 0.0001,
  //     network: 'ethereum',
  //     rpcUrl: 'https://ropsten.infura.io/v3/bff827defbfc496a8499d1b1d2223ae3',
  //     privateKey:
  //       '367df12b3064ba363de465bf299e78a68aae69932918b160f1724e688050f73d',
  //     gasPrice: '50',
  //   };

  //   const transfer = await multichainCryptoWallet.Wallet.transfer(payload);
  //   expect(typeof transfer).toBe('object');
  // });

  // it('transfer ERC20 Token', async () => {
  //   const payload = {
  //     toAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
  //     amount: 10,
  //     network: 'ethereum',
  //     rpcUrl: 'https://ropsten.infura.io/v3/bff827defbfc496a8499d1b1d2223ae3',
  //     privateKey:
  //       '367df12b3064ba363de465bf299e78a68aae69932918b160f1724e688050f73d',
  //     gasPrice: '20',
  //     tokenAddress: '0xD10AA4E963b633FdA3CB3deA1A841E18A55F5EED',
  //   };

  //   const transfer = await multichainCryptoWallet.Wallet.transfer(payload);
  //   expect(typeof transfer).toBe('object');
  // });

  it('transfer SOL', async () => {
    const payload = {
      toAddress: '9DSRMyr3EfxPzxZo9wMBPku7mvcazHTHfyjhcfw5yucA',
      amount: 0.000001,
      network: 'solana',
      rpcUrl: 'https://api.devnet.solana.com',
      privateKey:
        '29,198,51,133,81,69,10,183,93,222,58,136,45,183,253,222,10,228,33,159,151,153,121,225,53,28,72,171,208,79,17,162,57,183,38,12,243,95,127,182,194,193,162,35,145,14,189,246,152,12,13,124,234,223,8,173,165,41,130,239,4,176,133,167',
    };
    const transfer = await multichainCryptoWallet.Wallet.transfer(payload);

    expect(typeof transfer).toBe('object');
  });
});
