import {
  createWallet,
  generateMnemonic,
  generateWalletFromMnemonic,
  getAddressFromPrivateKey,
  getBalance,
  getTransaction,
  transfer,
  getTokenInfo,
} from '../src';

describe('MultichainCryptoWallet Solana tests', () => {
  it('generateMnemonic', () => {
    const mnemonic = generateMnemonic();

    expect(typeof mnemonic).toBe('string');
  });

  it('createWallet', () => {
    const wallet = createWallet({
      derivationPath: "m/44'/501'/0'/0'", // Leave empty to use default derivation path
      network: 'solana',
    });

    expect(typeof wallet).toBe('object');
  });

  it('generateWalletFromMnemonic', () => {
    const wallet = generateWalletFromMnemonic({
      mnemonic:
        'base dry mango subject neither labor portion weekend range couple right document',
      derivationPath: "m/44'/501'/0'/0'", // Leave empty to use default derivation path
      network: 'solana',
    });

    expect(typeof wallet).toBe('object');
  });

  it('getAddressFromPrivateKey', () => {
    const address = getAddressFromPrivateKey({
      privateKey:
        'bXXgTj2cgXMFAGpLHkF5GhnoNeUpmcJDsxXDhXQhQhL2BDpJumdwMGeC5Cs66stsN3GfkMH8oyHu24dnojKbtfp',
      network: 'solana',
    });

    expect(typeof address).toBe('object');
  });

  it('getBalance SOL', async () => {
    const data = await getBalance({
      address: '9DSRMyr3EfxPzxZo9wMBPku7mvcazHTHfyjhcfw5yucA',
      network: 'solana',
      rpcUrl: 'https://api.devnet.solana.com',
    });

    expect(typeof data).toBe('object');
  });

  it('getBalance token', async () => {
    const data = await getBalance({
      address: '9DSRMyr3EfxPzxZo9wMBPku7mvcazHTHfyjhcfw5yucA',
      tokenAddress: '6xRPFqbtpkS7iVd9SysZDXdYn6iWceXF7p3T91N3EcAc',
      network: 'solana',
      rpcUrl: 'https://api.devnet.solana.com',
    });

    expect(typeof data).toBe('object');
  });

  it('transfer', async () => {
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

  it('Get transaction', async () => {
    const receipt = await getTransaction({
      rpcUrl: 'https://api.devnet.solana.com',
      hash:
        'CkG1ynQ2vN8bmNsBUKG8ix3moUUfELWwd8K2f7mmqDd7LifFFfgyFhBux6t22AncbY4NR3PsEU3DbH7mDBMXWk7',
      network: 'solana',
    });

    expect(typeof receipt).toBe('object');
  });

  it('get SPL token info', async () => {
    const data = await getTokenInfo({
      address: '7Xn4mM868daxsGVJmaGrYxg8CZiuqBnDwUse66s5ALmr',
      network: 'solana',
      rpcUrl: 'https://api.devnet.solana.com',
      cluster: 'devnet',
    });

    expect(typeof data).toBe('object');
    expect(typeof (data && data.name)).toBe('string');
    expect(typeof (data && data.symbol)).toBe('string');
    expect(typeof (data && data.address)).toBe('string');
    expect(typeof (data && data.decimals)).toBe('number');
    expect(typeof (data && data.totalSupply)).toBe('number');
  });
});
