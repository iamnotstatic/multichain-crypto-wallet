import MultichainCryptoWallet from '../src/index';

describe('MultichainCryptoWallet', () => {
  const multichainCryptoWallet = new MultichainCryptoWallet();

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
});
