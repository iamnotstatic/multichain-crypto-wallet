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

  it('transfer ETH', async () => {
    const payload = {
      toAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
      amount: 0.0001,
      network: 'ethereum',
      rpcUrl: 'https://rinkeby.infura.io/v3/bff827defbfc496a8499d1b1d2223ae3',
      privateKey:
        '367df12b3064ba363de465bf299e78a68aae69932918b160f1724e688050f73d',
      gasPrice: '10',
    };

    const transfer = await multichainCryptoWallet.Wallet.transfer(payload);
    console.log('ETH transfer: ', transfer.hash);
    expect(typeof transfer).toBe('object');
  });

  it('transfer ERC20 Token', async () => {
    const payload = {
      toAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
      amount: 10,
      network: 'ethereum',
      rpcUrl: 'https://rinkeby.infura.io/v3/bff827defbfc496a8499d1b1d2223ae3',
      privateKey:
        '367df12b3064ba363de465bf299e78a68aae69932918b160f1724e688050f73d',
      gasPrice: '10',
      tokenAddress: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
    };

    const transfer = await multichainCryptoWallet.Wallet.transfer(payload);
    console.log('ERC20 transfer: ', transfer.hash);
    expect(typeof transfer).toBe('object');
  });

  it('transfer SOL', async () => {
    const payload = {
      toAddress: '9DSRMyr3EfxPzxZo9wMBPku7mvcazHTHfyjhcfw5yucA',
      amount: 0.000001,
      network: 'solana',
      rpcUrl: 'https://api.devnet.solana.com',
      privateKey:
        'bXXgTj2cgXMFAGpLHkF5GhnoNeUpmcJDsxXDhXQhQhL2BDpJumdwMGeC5Cs66stsN3GfkMH8oyHu24dnojKbtfp',
    };
    const transfer = await multichainCryptoWallet.Wallet.transfer(payload);
    console.log('SOL transfer: ', transfer.hash);
    expect(typeof transfer).toBe('object');
  });
});
