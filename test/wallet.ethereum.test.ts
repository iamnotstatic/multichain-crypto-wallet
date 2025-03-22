import {
  createWallet,
  generateMnemonic,
  generateWalletFromMnemonic,
  getAddressFromPrivateKey,
  getBalance,
  getTransaction,
  transfer,
  getWalletFromEncryptedJson,
  getEncryptedJsonFromPrivateKey,
  getTokenInfo,
  smartContractCall,
} from '../src';

describe('MultichainCryptoWallet Ethereum tests', () => {
  it('createWallet', () => {
    const wallet = createWallet({
      derivationPath: "m/44'/60'/0'/0/0", // Leave empty to use default derivation path
      network: 'ethereum',
    });

    expect(typeof wallet).toBe('object');
  });

  it('generateMnemonic', () => {
    const mnemonic = generateMnemonic(); // default is 12

    expect(typeof mnemonic).toBe('string');
  });

  it('generateWalletFromMnemonic', () => {
    const wallet = generateWalletFromMnemonic({
      mnemonic:
        'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
      derivationPath: "m/44'/60'/0'/0/0", // Leave empty to use default derivation path
      network: 'ethereum',
    });

    expect(typeof wallet).toBe('object');
  });

  it('getAddressFromPrivateKey', () => {
    const address = getAddressFromPrivateKey({
      privateKey:
        '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
      network: 'ethereum',
    });

    expect(typeof address).toBe('object');
  });

  it('getBalance ETH balance', async () => {
    const data = await getBalance({
      address: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
      network: 'ethereum',
      rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    });

    expect(typeof data).toBe('object');
  });

  it('getBalance ERC20 token balance', async () => {
    const data = await getBalance({
      address: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
      network: 'ethereum',
      rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
      tokenAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    });

    expect(typeof data).toBe('object');
  });

  it('transfer', async () => {
    const data = await transfer({
      recipientAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
      amount: 0.0001,
      network: 'ethereum',
      rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
      privateKey:
        '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
    });

    const tx = await getTransaction({
      hash: data.hash,
      network: 'ethereum',
      rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    });

    expect(typeof data).toBe('object');
    expect(typeof tx).toBe('object');
  });

  it('transfer ERC20 Token', async () => {
    const response = await transfer({
      recipientAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
      amount: 0.00001,
      network: 'ethereum',
      rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
      privateKey:
        '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
      tokenAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    });
    expect(typeof response).toBe('object');
  });

  it('Get transaction', async () => {
    const receipt = await getTransaction({
      rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
      hash:
        '0x45aa3634a7a15a7f5e23265fc98b229adba9ffa89ad68c1b48d6b0a27ef51398',
      network: 'ethereum',
    });

    expect(typeof receipt).toBe('object');
  });

  it('encrypts ethereum address privatekey and returns the encrypted json', async () => {
    const data = await getEncryptedJsonFromPrivateKey({
      privateKey:
        '0xdc062e5c5013699c844ee942b517b0ee663bd22786e186e6e437db45e8790d2c',
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
      address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      network: 'ethereum',
      rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    });

    expect(typeof data).toBe('object');
    expect(typeof (data && data.name)).toBe('string');
    expect(typeof (data && data.symbol)).toBe('string');
    expect(typeof (data && data.address)).toBe('string');
    expect(typeof (data && data.decimals)).toBe('number');
    expect(typeof (data && data.totalSupply)).toBe('string');
  });

  it('smart contract call (get token Balance)', async () => {
    const data = await smartContractCall({
      rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
      network: 'ethereum',
      contractAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      method: 'balanceOf',
      methodType: 'read',
      params: ['0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22'],
    });

    expect(typeof data).toBe('object');
  });

  it('smart contract call (ERC20 token transfer)', async () => {
    const data = await smartContractCall({
      rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
      network: 'ethereum',
      contractAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      method: 'transfer',
      methodType: 'write',
      params: [
        '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
        '1000000000000000000',
      ],
      contractAbi: [
        {
          constant: false,
          inputs: [
            { name: '_to', type: 'address' },
            { name: '_value', type: 'uint256' },
          ],
          name: 'transfer',
          outputs: [{ name: '', type: 'bool' }],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      privateKey:
        '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
    });

    expect(typeof data).toBe('object');
  });

  it('smart contract call (get factory Uniswap)', async () => {
    const data = await smartContractCall({
      rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
      network: 'ethereum',
      contractAddress: '0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3',
      method: 'factory',
      methodType: 'read',
      params: [],
      contractAbi: [
        {
          inputs: [],
          name: 'factory',
          outputs: [{ internalType: 'address', name: '', type: 'address' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
    });

    expect(typeof data).toBe('object');
  });
});
