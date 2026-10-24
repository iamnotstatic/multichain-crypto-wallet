import {
  createWallet,
  generateMnemonic,
  generateWalletFromMnemonic,
  getAddressFromPrivateKey,
  getBalance,
  transfer,
  getTransaction,
  getTokenInfo,
} from '../src';

describe('MultichainCryptoWallet Ton tests', () => {
  const tonCenterApiKey = '45b1c87ea1c172aa473658931cb2b58c52e1c8d9aa904e5fd8e2937eff29c013';
  const tonCenterRpc = "https://testnet.toncenter.com/api/v2/jsonRPC";
  // Generate From Tonkeeper app 
  const mnemonic24 = "august series long climb rain arrest unfair pill share funny rubber easy pulse vibrant settle inflict castle winter left duty you flower problem betray";
  const expectedAddress24v4 = "0QBG61c4TjKqyiELE3CrxqSVHL6Lkl4D28K1A9oB8G13sXDG";
  const expectedAddress24v5 = "0QBh77kXMw-M-kg4L6EzP_6Jlx5xTh7mRbkM-zDjngphErgc";
  const privateKey24 = "0808b63ccb05a826085acdb68465e04f428fee6781ed7f770fbe785e32ff56941aab493f5d1c5e94c0fd4a04934c988998c3803110180d26baa940fe602f60bc"
  // Generate From Trustwallet or SDK
  const mnemonic12 = "gallery follow round rookie rely pupil expect auto wonder stairs protect connect";
  const expectedAddress12v4 = "UQAa9bnNsobIO5PwrLr7oKiLHk2GBzBNEAIYIjL_FMpwP7M-";
  const expectedAddress12v5 = "UQAqnG6hJtc6Vp_T6rezHHQG_d1v4HCwuvQDM4VKYrlwvon3";
  const privateKey12 = "d5eb32f5eea03e446eee06401d2de6cc146a9768c8c614a298d556e86773d3edcaab63276f86daa2d3fba585f712c146eb2aa1494aad61535810a31eaf245b6a"

  it('generateMnemonic', () => {
    const mnemonic = generateMnemonic();

    expect(typeof mnemonic).toBe('string');
  });

  it('createWallet V4', async () => {
    const wallet = await createWallet({
      cluster: 'testnet',
      network: 'ton',
    });

    expect(typeof wallet).toBe('object');
    expect(wallet).toHaveProperty('address');
    expect(wallet).toHaveProperty('privateKey');
    expect(wallet).toHaveProperty('mnemonic');
  });

  it('createWallet W5', async () => {
    const wallet = await createWallet({
      walletVersion: "W5",
      cluster: 'testnet',
      network: 'ton',
    });

    expect(typeof wallet).toBe('object');
    expect(wallet).toHaveProperty('address');
    expect(wallet).toHaveProperty('privateKey');
    expect(wallet).toHaveProperty('mnemonic');
  });

  it('generateWalletFromMnemonic 12 V4', async () => {
    const wallet = await generateWalletFromMnemonic({
      mnemonic: mnemonic12,
      walletVersion: "v4R2",
      cluster: "mainnet",
      network: 'ton',
    });

    expect(typeof wallet).toBe('object');
    expect(wallet).toHaveProperty('address');
    expect(wallet).toHaveProperty('privateKey');
    expect(wallet).toHaveProperty('mnemonic');
    expect(wallet.address).toBe(expectedAddress12v4);
  });

  it('generateWalletFromMnemonic 12 W5', async () => {
    const wallet = await generateWalletFromMnemonic({
      mnemonic: mnemonic12,
      walletVersion: "W5",
      cluster: "mainnet",
      network: 'ton',
    });

    expect(typeof wallet).toBe('object');
    expect(wallet).toHaveProperty('address');
    expect(wallet).toHaveProperty('privateKey');
    expect(wallet).toHaveProperty('mnemonic');
    expect(wallet.address).toBe(expectedAddress12v5);
  });

  it('generateWalletFromMnemonic 24 V4', async () => {
    const wallet = await generateWalletFromMnemonic({
      mnemonic: mnemonic24,
      walletVersion: "v4R2",
      cluster: "testnet",
      network: 'ton',
    });

    expect(typeof wallet).toBe('object');
    expect(wallet).toHaveProperty('address');
    expect(wallet).toHaveProperty('privateKey');
    expect(wallet).toHaveProperty('mnemonic');
    expect(wallet.address).toBe(expectedAddress24v4);
  });

  it('generateWalletFromMnemonic 24 W5', async () => {
    const wallet = await generateWalletFromMnemonic({
      mnemonic: mnemonic24,
      walletVersion: "W5",
      cluster: "testnet",
      network: 'ton',
    });

    expect(typeof wallet).toBe('object');
    expect(wallet).toHaveProperty('address');
    expect(wallet).toHaveProperty('privateKey');
    expect(wallet).toHaveProperty('mnemonic');
    expect(wallet.address).toBe(expectedAddress24v5);
  });

  it('getAddressFromPrivateKey12 V4', () => {
    const address = getAddressFromPrivateKey({
      privateKey: privateKey12,
      walletVersion: "v4R2",
      network: 'ton',
    });

    expect(typeof address).toBe('object');
    expect(address).toHaveProperty('address');
    expect(typeof address.address).toBe('string');
  });

  it('getAddressFromPrivateKey12 W5', () => {
    const address = getAddressFromPrivateKey({
      privateKey: privateKey12,
      walletVersion: "W5",
      network: 'ton',
    });

    expect(typeof address).toBe('object');
    expect(address).toHaveProperty('address');
    expect(typeof address.address).toBe('string');
  });

  it('getAddressFromPrivateKey24 V4', () => {
    const address = getAddressFromPrivateKey({
      privateKey: privateKey24,
      walletVersion: "v4R2",
      network: 'ton',
    });

    expect(typeof address).toBe('object');
    expect(address).toHaveProperty('address');
    expect(typeof address.address).toBe('string');
  });

  it('getAddressFromPrivateKey24 W5', () => {
    const address = getAddressFromPrivateKey({
      privateKey: privateKey24,
      walletVersion: "W5",
      network: 'ton',
    });

    expect(typeof address).toBe('object');
    expect(address).toHaveProperty('address');
    expect(typeof address.address).toBe('string');
  });

  it('getBalance native TON V4', async () => {
    const data = await getBalance({
      address: expectedAddress24v4,
      privateKey: privateKey24,
      apiKey: tonCenterApiKey,
      network: 'ton',
      rpcUrl: tonCenterRpc,
      walletVersion: "v4R2"
    });

    expect(typeof data).toBe('object');
    expect(data).toHaveProperty('balance');
    expect(typeof data.balance).toBe('string');
  });

  it('getBalance native TON V5', async () => {
    const data = await getBalance({
      address: expectedAddress24v5,
      privateKey: privateKey24,
      apiKey: tonCenterApiKey,
      network: 'ton',
      rpcUrl: tonCenterRpc,
      walletVersion: "W5",
    });

    expect(typeof data).toBe('object');
    expect(data).toHaveProperty('balance');
    expect(typeof data.balance).toBe('string');
  });

  it('getBalance testnet Jetton token', async () => {
    const data = await getBalance({
      address: expectedAddress24v4,
      privateKey: privateKey24,
      apiKey: tonCenterApiKey,
      tokenAddress: 'kQB519C3IXFgCr4qKj6QrtaB9Pm3Sawr-Gonlo3O0cKL_I03',
      network: 'ton',
      rpcUrl: tonCenterRpc,
    });

    expect(typeof data).toBe('object');
    expect(data).toHaveProperty('balance');
    expect(typeof data.balance).toBe('string');
  });

  it('transfer TON V4', async () => {
    const response = await transfer({
      recipientAddress: expectedAddress24v5,
      amount: 0.1,
      memo: "Sending Ton to Wallet W5",
      network: 'ton',
      apiKey: tonCenterApiKey,
      rpcUrl: tonCenterRpc,
      privateKey: privateKey24,
    });

    expect(typeof response).toBe('object');
  });

  it('transfer TON W5', async () => {
    const response = await transfer({
      recipientAddress: expectedAddress24v4,
      amount: 0.1,
      memo: "Sending Ton to Wallet V4",
      network: 'ton',
      apiKey: tonCenterApiKey,
      rpcUrl: tonCenterRpc,
      privateKey: privateKey24,
      walletVersion: "W5",
    });

    expect(typeof response).toBe('object');
  });

  it('transfer Jetton Token on Ton Testnet', async () => {
    const response = await transfer({
      recipientAddress: expectedAddress24v5,
      tokenAddress: 'kQB519C3IXFgCr4qKj6QrtaB9Pm3Sawr-Gonlo3O0cKL_I03',
      amount: 0.1,
      forwardGas: 0, // remove for default Jetton Only
      network: 'ton',
      apiKey: tonCenterApiKey,
      rpcUrl: tonCenterRpc,
      privateKey: privateKey24,
    });

    expect(typeof response).toBe('object');
  });

  it('getTransaction from hash', async () => {
    const receipt = await getTransaction({
      apiKey: tonCenterApiKey,
      rpcUrl: tonCenterRpc,
      address: expectedAddress24v5,
      hash: '7a74b1e743f4251079afcb898f678c997820febb714103da417b2dd1370f968c',
      logicalTime: '39457313000003',
      network: 'ton',
    });

    expect(typeof receipt).toBe('object');
  });

  it('getTokenInfo (Hipo Testnet Coin)', async () => {
    const tokenInfo = await getTokenInfo({
      address: 'kQB519C3IXFgCr4qKj6QrtaB9Pm3Sawr-Gonlo3O0cKL_I03',
      network: 'ton',
      apiKey: tonCenterApiKey,
      rpcUrl: tonCenterRpc,
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
});