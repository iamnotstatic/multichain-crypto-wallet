import MultichainCryptoWallet from '../src/index';

describe('MultichainCryptoWallet', () => {
  const multichainCryptoWallet = new MultichainCryptoWallet();

  jest.setTimeout(300000000);

  it('instantiate SDK', () => {
    expect(multichainCryptoWallet).toBeTruthy();
  });

  it('getBalance ETH balance', async () => {
    const data = await multichainCryptoWallet.Wallet.getBalance({
      address: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
      network: 'ethereum',
      rpcUrl: 'https://rpc.ankr.com/eth', // Optional - leave empty to use default
    });

    expect(typeof data).toBe('object');
  });

  it('getBalance ERC20 token balance', async () => {
    const data = await multichainCryptoWallet.Wallet.getBalance({
      address: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
      network: 'ethereum',
      rpcUrl: 'https://rpc.ankr.com/eth', // Optional - leave empty to use default
      tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      privateKey:
        '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
    });

    expect(typeof data).toBe('object');
  });

  it('getBalance SOLANA', async () => {
    const data = await multichainCryptoWallet.Wallet.getBalance({
      address: '5PwN5k7hin2XxUUaXveur7jSe5qt2mkWinp1JEiv8xYu',
      network: 'solana',
      rpcUrl: 'https://rpc.ankr.com/solana', // Optional - leave empty to use default
    });

    expect(typeof data).toBe('object');
  });

  it('createWallet ETH', async () => {
    const wallet = await multichainCryptoWallet.Wallet.createWallet({
      network: 'ethereum',
    });

    expect(typeof wallet).toBe('object');
  });

  it('createWallet SOLANA', async () => {
    const wallet = await multichainCryptoWallet.Wallet.createWallet({
      network: 'solana',
    });

    expect(typeof wallet).toBe('object');
  });

  it('transfer ETH', async () => {
    const payload = {
      toAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
      amount: 0.0001,
      network: 'ethereum',
      rpcUrl: 'https://rpc.ankr.com/eth', // Optional - leave empty to use default
      privateKey:
        '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
      gasPrice: '10', // Optional - leave empty for default
    };

    const transfer = await multichainCryptoWallet.Wallet.transfer(payload);
    expect(typeof transfer).toBe('object');
  });

  it('transfer ERC20 Token', async () => {
    const payload = {
      toAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
      amount: 10,
      network: 'ethereum',
      rpcUrl: 'https://rpc.ankr.com/eth',
      privateKey:
        '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
      gasPrice: '10', // Optional - leave empty for default
      tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    };

    const transfer = await multichainCryptoWallet.Wallet.transfer(payload);
    expect(typeof transfer).toBe('object');
  });

  it('transfer SOL', async () => {
    const payload = {
      toAddress: '9DSRMyr3EfxPzxZo9wMBPku7mvcazHTHfyjhcfw5yucA',
      amount: 0.000001,
      network: 'solana',
      rpcUrl: 'https://rpc.ankr.com/solana',  // Optional - leave empty for default
      privateKey:
        'bXXgTj2cgXMFAGpLHkF5GhnoNeUpmcJDsxXDhXQhQhL2BDpJumdwMGeC5Cs66stsN3GfkMH8oyHu24dnojKbtfp',
    };

    const transfer = await multichainCryptoWallet.Wallet.transfer(payload);
    expect(typeof transfer).toBe('object');
  });

  it('Override ERC20 token pending transaction on ethereum', async () => {
    const payload = {
      toAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
      amount: 0,
      network: 'ethereum',
      rpcUrl: 'https://rpc.ankr.com/eth',  // Optional - leave empty for default
      privateKey:
        '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
      gasPrice: '10', // Optional - leave empty for default
      tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      nonce: 1,
    };

    const transfer = await multichainCryptoWallet.Wallet.transfer(payload);
    expect(typeof transfer).toBe('object');
  });

  it('Override pending ETH transactionm', async () => {
    const payload = {
      toAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
      amount: 0,
      network: 'ethereum',
      rpcUrl: 'https://rpc.ankr.com/eth',  // Optional - leave empty for default
      privateKey:
        '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
      gasPrice: '10', // Optional - leave empty for default
      nonce: 1,
    };

    const transfer = await multichainCryptoWallet.Wallet.transfer(payload);
    expect(typeof transfer).toBe('object');
  });
});
