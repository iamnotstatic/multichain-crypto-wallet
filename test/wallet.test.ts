import {
  getBalance,
  createWallet,
  generateWalletFromMnemonic,
  getAddressFromPrivateKey,
  getTransaction,
  transfer,
} from '../src';

describe('MultichainCryptoWallet', () => {
  it('getBalance ETH balance', async () => {
    const data = await getBalance({
      address: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
      network: 'ethereum',
      rpcUrl: 'https://rinkeby-light.eth.linkpool.io',
    });

    expect(typeof data).toBe('object');
  });

  it('getBalance ERC20 token balance', async () => {
    const data = await getBalance({
      address: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
      network: 'ethereum',
      rpcUrl: 'https://rinkeby-light.eth.linkpool.io',
      tokenAddress: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
    });

    expect(typeof data).toBe('object');
  });

  it('getBalance SOLANA', async () => {
    const data = await getBalance({
      address: '9DSRMyr3EfxPzxZo9wMBPku7mvcazHTHfyjhcfw5yucA',
      network: 'solana',
      rpcUrl: 'https://api.devnet.solana.com',
    });

    expect(typeof data).toBe('object');
  });

  it('getBalance token SOLANA', async () => {
    const data = await getBalance({
      address: '9DSRMyr3EfxPzxZo9wMBPku7mvcazHTHfyjhcfw5yucA',
      tokenAddress: '6xRPFqbtpkS7iVd9SysZDXdYn6iWceXF7p3T91N3EcAc',
      network: 'solana',
      rpcUrl: 'https://api.devnet.solana.com',
    });

    expect(typeof data).toBe('object');
  });

  it('createWallet ETH', async () => {
    const wallet = await createWallet({
      network: 'ethereum',
    });

    expect(typeof wallet).toBe('object');
  });

  it('createWallet SOLANA', async () => {
    const wallet = await createWallet({
      derivationPath: "m/44'/501'/0'/0'", // Leave empty to use default derivation path
      network: 'solana',
    });

    expect(typeof wallet).toBe('object');
  });

  it('generateWalletFromMnemonic ETH', async () => {
    const wallet = await generateWalletFromMnemonic({
      mnemonic:
        'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
      network: 'ethereum',
    });

    expect(typeof wallet).toBe('object');
  });

  it('generateWalletFromMnemonic SOLANA', async () => {
    const wallet = await generateWalletFromMnemonic({
      mnemonic:
        'base dry mango subject neither labor portion weekend range couple right document',
      derivationPath: "m/44'/501'/0'/0'", // Leave empty to use default derivation path
      network: 'solana',
    });

    expect(typeof wallet).toBe('object');
  });

  it('getAddressFromPrivateKey ETH', async () => {
    const address = await getAddressFromPrivateKey({
      privateKey:
        '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
      network: 'ethereum',
    });

    expect(typeof address).toBe('object');
  });

  it('getAddressFromPrivateKey SOLANA', async () => {
    const address = await getAddressFromPrivateKey({
      privateKey:
        'bXXgTj2cgXMFAGpLHkF5GhnoNeUpmcJDsxXDhXQhQhL2BDpJumdwMGeC5Cs66stsN3GfkMH8oyHu24dnojKbtfp',
      network: 'solana',
    });

    expect(typeof address).toBe('object');
  });

  it('transfer ETH', async () => {
    const payload = {
      recipientAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
      amount: 0.0001,
      network: 'ethereum',
      rpcUrl: 'https://rinkeby-light.eth.linkpool.io',
      privateKey:
        '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
    };

    const data = await transfer(payload);
    expect(typeof data).toBe('object');
  });

  it('transfer ERC20 Token', async () => {
    const payload = {
      recipientAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
      amount: 5,
      network: 'ethereum',
      rpcUrl: 'https://rinkeby-light.eth.linkpool.io',
      privateKey:
        '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
      tokenAddress: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
    };

    const response = await transfer(payload);
    expect(typeof response).toBe('object');
  });

  it('transfer SOL', async () => {
    const payload = {
      recipientAddress: '9DSRMyr3EfxPzxZo9wMBPku7mvcazHTHfyjhcfw5yucA',
      amount: 0.0001,
      network: 'solana',
      rpcUrl: 'https://api.devnet.solana.com',
      privateKey:
        'qUfgDqNZ8EmZtG7FCdvo8ETTQb8crmzcYUdrVdpjfxZiVkrwSjQ9L2ov55oRt25ZSJXCjHw6hqtKJnxdnoGtp1M',
    };

    const response = await transfer(payload);
    expect(typeof response).toBe('object');
  });

  it('transfer Token on Solana', async () => {
    const payload = {
      recipientAddress: '9DSRMyr3EfxPzxZo9wMBPku7mvcazHTHfyjhcfw5yucA',
      tokenAddress: '6xRPFqbtpkS7iVd9SysZDXdYn6iWceXF7p3T91N3EcAc',
      amount: 1,
      network: 'solana',
      rpcUrl: 'https://api.devnet.solana.com',
      privateKey:
        'qUfgDqNZ8EmZtG7FCdvo8ETTQb8crmzcYUdrVdpjfxZiVkrwSjQ9L2ov55oRt25ZSJXCjHw6hqtKJnxdnoGtp1M',
    };

    const response = await transfer(payload);

    expect(typeof response).toBe('object');
  });

  it('Get transaction on Ethereum', async () => {
    const receipt = await getTransaction({
      rpcUrl: 'https://rinkeby-light.eth.linkpool.io',
      hash:
        '0x5a90cea37e3a5dbee6e10190ff5a3769ad27a0c6f625458682104e26e0491055',
      network: 'ethereum',
    });

    expect(typeof receipt).toBe('object');
  });

  it('Get transaction on Solana', async () => {
    const receipt = await getTransaction({
      rpcUrl: 'https://api.devnet.solana.com',
      hash:
        'CkG1ynQ2vN8bmNsBUKG8ix3moUUfELWwd8K2f7mmqDd7LifFFfgyFhBux6t22AncbY4NR3PsEU3DbH7mDBMXWk7',
      network: 'solana',
    });

    expect(typeof receipt).toBe('object');
  });
});
