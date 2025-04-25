import {
  createWallet,
  generateMnemonic,
  generateWalletFromMnemonic,
  getAddressFromPrivateKey,
  getBalance,
  transfer,
  getTransaction,
  getTokenInfo,
  smartContractCall,
} from '../src';

describe('MultichainCryptoWallet Sui tests', () => {
  const suiTestnetRpc = 'https://fullnode.testnet.sui.io:443';
  const testPrivateKey =
    'suiprivkey1qpppfvzg767qahlw6eu09m2ql3uvc59xqgt3l0un06lvnf8yjxac6v37z3e';
  const USDC_TESTNET_TOKEN =
    '0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC';

  const nftName = 'NFT that has usdc logo';
  const nftDescription = 'A test nft';
  const recipientAddress =
    '0x7264e741063b6b064cdb780b44578db213cdff9e5641abb2c34a5b5c55307579';
  const nftImgUrl = 'https://circle.com/usdc-icon';

  const packageId =
    '0x086162ecfab930c92b2773f0f878f4998bad6c4fd9d2135fc58f8592ed9f4854';
  const moduleName = 'Nft';
  const moduleMethod = 'mint';

  const NFT_MINT_CONTRACT = `${packageId}::${moduleName}::${moduleMethod}`;

  it('generateMnemonic', () => {
    const mnemonic = generateMnemonic();
    expect(typeof mnemonic).toBe('string');
  });

  it('createWallet', () => {
    const wallet = createWallet({
      derivationPath: "m/44'/784'/0'/0'/0'", // Default Sui derivation path
      network: 'sui',
    });

    expect(typeof wallet).toBe('object');
    expect(wallet.data).toHaveProperty('address');
    expect(wallet.data).toHaveProperty('privateKey');
    expect(wallet.data).toHaveProperty('mnemonic');
  });

  it('generateWalletFromMnemonic', () => {
    const wallet = generateWalletFromMnemonic({
      mnemonic:
        'ship friend modify merit dune tower ritual off assault resemble vintage solid',
      derivationPath: "m/44'/784'/0'/0'/0'",
      network: 'sui',
    });

    expect(typeof wallet).toBe('object');
    expect(wallet.data).toHaveProperty('address');
    expect(wallet.data).toHaveProperty('privateKey');
    expect(wallet.data).toHaveProperty('mnemonic');
  });

  it('getAddressFromPrivateKey', () => {
    const address = getAddressFromPrivateKey({
      privateKey: testPrivateKey,
      network: 'sui',
    });

    expect(typeof address).toBe('object');
    expect(address.data).toHaveProperty('address');
    expect(typeof address.data.address).toBe('string');
  });

  it('getBalance native SUI', async () => {
    const data = await getBalance({
      address:
        '0xc8ef1c69d448b8c373c6de6f7170b0dc4ab8804591601c77ac6d6d0aad9fb914',
      network: 'sui',
      rpcUrl: suiTestnetRpc,
    });

    expect(typeof data).toBe('object');
    expect(data.data).toHaveProperty('balance');
    expect(typeof data.data.balance).toBe('number');
  });

  it('getBalance USDC testnet token', async () => {
    const data = await getBalance({
      address:
        '0xc8ef1c69d448b8c373c6de6f7170b0dc4ab8804591601c77ac6d6d0aad9fb914',
      tokenAddress: USDC_TESTNET_TOKEN,
      network: 'sui',
      rpcUrl: suiTestnetRpc,
    });

    expect(typeof data).toBe('object');
    expect(data.data).toHaveProperty('balance');
    expect(typeof data.data.balance).toBe('number');
  });

  it('transfer SUI', async () => {
    const response = await transfer({
      recipientAddress:
        '0xc8ef1c69d448b8c373c6de6f7170b0dc4ab8804591601c77ac6d6d0aad9fb914',
      amount: 0.01, // Small amount for testing
      network: 'sui',
      rpcUrl: suiTestnetRpc,
      privateKey: testPrivateKey,
    });

    expect(typeof response).toBe('object');
    expect(response.data).toHaveProperty('digest');
  });

  it('transfer USDC Token on Sui Testnet', async () => {
    const response = await transfer({
      recipientAddress:
        '0xc8ef1c69d448b8c373c6de6f7170b0dc4ab8804591601c77ac6d6d0aad9fb914',
      tokenAddress: USDC_TESTNET_TOKEN,
      amount: 0.1,
      network: 'sui',
      rpcUrl: suiTestnetRpc,
      privateKey: testPrivateKey,
    });

    expect(typeof response).toBe('object');
    expect(response.data).toHaveProperty('digest');
  });

  it('getTransaction from hash', async () => {
    const receipt = await getTransaction({
      rpcUrl: suiTestnetRpc,
      hash: 'AsU5WsBm8kZtuC2hQNyX3zv3CpvHUznE3mLEVewsgp4V',
      network: 'sui',
    });

    expect(typeof receipt).toBe('object');
    expect(receipt.data).toHaveProperty('digest');
  });

  it('getTokenInfo', async () => {
    const data = await getTokenInfo({
      address: USDC_TESTNET_TOKEN,
      network: 'sui',
      rpcUrl: suiTestnetRpc,
    });

    expect(data).toBeDefined();
    expect(typeof data).toBe('object');
    expect(typeof (data && data.data)).toBe('object');
    expect(typeof (data && data.data.name)).toBe('string');
    expect(typeof (data && data.data.symbol)).toBe('string');
    expect(typeof (data && data.data.address)).toBe('string');
    expect(typeof (data && data.data.decimals)).toBe('number');
    expect(typeof (data && data.data.totalSupply)).toBe('string');
  });


  it('smartContractCall write (mint an NFT on testnet)', async () => {
    const response = await smartContractCall({
      contractAddress: NFT_MINT_CONTRACT,
      params: [nftName, nftDescription, recipientAddress, nftImgUrl],
      paramTypes: ['string', 'string', 'address', 'string'],
      method: moduleMethod,
      methodType: 'write',
      network: 'sui',
      rpcUrl: suiTestnetRpc,
      privateKey: testPrivateKey,
      gasLimit: 1000000,
    });

    expect(typeof response).toBe('object');
  });

   // Sui does not have "view" functions, but you can simulate any function call (dry run) to see what would happen/retrieve data,  
 it('smartContractCall read (getting owner of a global counter object)', async () => {
    const response = await smartContractCall({
      contractAddress: '0x775d945700b8e8033df0a2d2b9d1d22ae01e952f47ebe913438c03a17287798c::counter::owner',
      params: [],
      paramTypes: [],
      method: 'owner',
      methodType: 'read',
      network: 'sui',
      rpcUrl: suiTestnetRpc,
      sender: '0xc8ef1c69d448b8c373c6de6f7170b0dc4ab8804591601c77ac6d6d0aad9fb914',
    });

    expect(typeof response).toBe('object');
  });

});
