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
  const moduleName = 'nft';
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
    expect(wallet).toHaveProperty('address');
    expect(wallet).toHaveProperty('privateKey');
    expect(wallet).toHaveProperty('mnemonic');
  });

  it('generateWalletFromMnemonic', () => {
    const wallet = generateWalletFromMnemonic({
      mnemonic:
        'ship friend modify merit dune tower ritual off assault resemble vintage solid',
      derivationPath: "m/44'/784'/0'/0'/0'",
      network: 'sui',
    });

    expect(typeof wallet).toBe('object');
    expect(wallet).toHaveProperty('address');
    expect(wallet).toHaveProperty('privateKey');
    expect(wallet).toHaveProperty('mnemonic');
  });

  it('getAddressFromPrivateKey', () => {
    const address = getAddressFromPrivateKey({
      privateKey: testPrivateKey,
      network: 'sui',
    });

    expect(typeof address).toBe('object');
    expect(address).toHaveProperty('address');
    expect(typeof address.address).toBe('string');
  });

  it('getBalance native SUI', async () => {
    const data = await getBalance({
      address:
        '0xc8ef1c69d448b8c373c6de6f7170b0dc4ab8804591601c77ac6d6d0aad9fb914',
      network: 'sui',
      rpcUrl: suiTestnetRpc,
    });

    expect(typeof data).toBe('object');
    expect(data).toHaveProperty('balance');
    expect(typeof data.balance).toBe('number');
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
    expect(data).toHaveProperty('balance');
    expect(typeof data.balance).toBe('number');
  });

  it('transfer SUI', async () => {
    const response = await transfer({
      recipientAddress: recipientAddress,
      amount: 0.01, 
      network: 'sui',
      rpcUrl: suiTestnetRpc,
      privateKey: testPrivateKey,
    });

    expect(typeof response).toBe('object');
    expect(response).toHaveProperty('digest');
  });

  it('transfer USDC Token on Sui Testnet', async () => {
    const response = await transfer({
      recipientAddress: recipientAddress,
      tokenAddress: USDC_TESTNET_TOKEN,
      amount: 0.1,
      network: 'sui',
      rpcUrl: suiTestnetRpc,
      privateKey: testPrivateKey,
    });

    expect(typeof response).toBe('object');
    expect(response).toHaveProperty('digest');
  });

  it('getTransaction from hash', async () => {
    const receipt = await getTransaction({
      rpcUrl: suiTestnetRpc,
      hash: 'AsU5WsBm8kZtuC2hQNyX3zv3CpvHUznE3mLEVewsgp4V',
      network: 'sui',
    });

    expect(typeof receipt).toBe('object');
    expect(receipt).toHaveProperty('digest');
  });

  it('getTokenInfo (USDC Testnet Coin)', async () => {
    const tokenInfo = await getTokenInfo({
      address: USDC_TESTNET_TOKEN,
      network: 'sui',
      rpcUrl: suiTestnetRpc,
    });

    expect(tokenInfo).toBeDefined();
    expect(typeof tokenInfo).toBe('object');
    expect(tokenInfo).toHaveProperty('name');
    expect(tokenInfo).toHaveProperty('symbol');
    expect(tokenInfo).toHaveProperty('address');
    expect(tokenInfo).toHaveProperty('decimals');
    expect(tokenInfo).toHaveProperty('logoUrl');
    expect(tokenInfo).toHaveProperty('totalSupply');

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
      gasLimit: 10000000,
    });
    expect(typeof response).toBe('object');
  });

  it('smartContractCall read (getting owner of a global counter object)', async () => {
    const response = await smartContractCall({
      contractAddress: '0x7190cfaecbe30eea5afd180c426b4a14f5ca5a333cc96a12aecc86eb2d508f7e::counter::owner',
      params: ['0xaf7a0a1346420a575015429cc4289a1d55faf37d93fa69bb07a1619b3be5665c'], //This is the counter object we want to get its owner
      paramTypes: ['object'],
      method: 'owner',
      methodType: 'read',
      network: 'sui',
      rpcUrl: suiTestnetRpc,
      sender: '0xc8ef1c69d448b8c373c6de6f7170b0dc4ab8804591601c77ac6d6d0aad9fb914',
    });

    expect(typeof response).toBe('object');
  });
});