import {
  getBalance,
  createWallet,
  generateWalletFromMnemonic,
  getAddressFromPrivateKey,
  getTransaction,
  transfer,
  getWalletFromEncryptedJson,
  getEncryptedJsonFromPrivateKey,
  getTokenInfo,
  smartContractCall,
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
      derivationPath: "m/44'/60'/0'/0/0", // Leave empty to use default derivation path
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
      derivationPath: "m/44'/60'/0'/0/0", // Leave empty to use default derivation path
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

  it('encrypts ethereum address privatekey and returns the encrypted json', async () => {
    const data = await getEncryptedJsonFromPrivateKey({
      privateKey:
        '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
      network: 'ethereum',
      password: 'walletpassword',
    });

    expect(typeof data).toBe('object');
    expect(typeof (data && data.json)).toBe('string');
  });

  it('decrypts ethereum address and returns the wallet details', async () => {
    const data = await getWalletFromEncryptedJson({
      json:
        '{"address":"1c082d1052fb44134a408651c01148adbfcce7fe","id":"ca8b45b0-e69d-4e5e-8003-8f3dbb1082cf","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"fe66bd308ad315126ae6f09f0d6599f4"},"ciphertext":"5f2abe02e49868c36df36f884680b132333e541f89cd7eb375247ff7c8a6ccdd","kdf":"scrypt","kdfparams":{"salt":"2570bf687cb7d9cd694e1c79f6e817c9c66467e81b04013104620670f0664bf5","n":131072,"dklen":32,"p":1,"r":8},"mac":"35f69fb7283c65d75c000a0c93042c063d2903efe9b9e6f03b05d842f47ed1e9"}}',
      network: 'ethereum',
      password: 'walletpassword',
    });

    expect(typeof data).toBe('object');
    expect(typeof (data && data.privateKey)).toBe('string');
    expect(typeof (data && data.address)).toBe('string');
  });

  it('get ERC20 token info', async () => {
    const data = await getTokenInfo({
      address: '0x7fe03a082fd18a80a7dbd55e9b216bcf540557e4',
      network: 'ethereum',
      rpcUrl: 'https://rinkeby-light.eth.linkpool.io',
    });

    expect(typeof data).toBe('object');
    expect(typeof (data && data.name)).toBe('string');
    expect(typeof (data && data.symbol)).toBe('string');
    expect(typeof (data && data.address)).toBe('string');
    expect(typeof (data && data.decimals)).toBe('number');
    expect(typeof (data && data.totalSupply)).toBe('number');
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

  it('smart contract call (get token Balance)', async () => {
    const data = await smartContractCall({
      rpcUrl: 'https://rinkeby-light.eth.linkpool.io',
      network: 'ethereum',
      contractAddress: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
      method: 'balanceOf',
      methodType: 'read',
      params: ['0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22'],
    });

    expect(typeof data).toBe('object');
  });

  it('smart contract call (ERC20 token transfer)', async () => {
    const data = await smartContractCall({
      rpcUrl: 'https://rinkeby-light.eth.linkpool.io',
      network: 'ethereum',
      contractAddress: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
      method: 'transfer',
      methodType: 'write',
      params: [
        '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
        '1000000000000000000',
      ],
      privateKey:
        '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
    });

    expect(typeof data).toBe('object');
  });
});
