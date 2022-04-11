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

    expect(wallet).toBeTruthy();
  });

  it('createWallet SOLANA', async () => {
    const wallet = await multichainCryptoWallet.Wallet.createWallet('solana');

    expect(wallet).toBeTruthy();
  });

  it('transfer ETH', async () => {
    const transfer = await multichainCryptoWallet.Wallet.transfer(
      '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
      0.0001,
      'ethereum',
      'https://rinkeby.infura.io/v3/bff827defbfc496a8499d1b1d2223ae3',
      '367df12b3064ba363de465bf299e78a68aae69932918b160f1724e688050f73d'
    );

    expect(transfer).toBeTruthy();
  });

  it('transfer ERC20 Token', async () => {
    const transfer = await multichainCryptoWallet.Wallet.transfer(
      '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
      100,
      'ethereum',
      'https://rinkeby.infura.io/v3/bff827defbfc496a8499d1b1d2223ae3',
      '367df12b3064ba363de465bf299e78a68aae69932918b160f1724e688050f73d',
      '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa'
    );

    expect(transfer).toBeTruthy();
  });
});
