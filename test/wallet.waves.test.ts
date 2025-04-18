import {
  generateMnemonic,
  createWallet,
  generateWalletFromMnemonic,
  getBalance,
  getTransaction,
  getTokenInfo,
  transfer,
  smartContractCall,
  getAddressFromPrivateKey,
} from '../src';

describe('MultichainCryptoWallet Waves tests', () => {
  it('generateMnemonic', () => {
    const mnemonic = generateMnemonic();

    expect(typeof mnemonic).toBe('string');
  });

  it('createWallet', () => {
    const wallet = createWallet({ cluster: 'mainnet', network: 'waves' });

    expect(typeof wallet).toBe('object');
    expect(typeof wallet.address).toBe('string');
    expect(typeof wallet.mnemonic).toBe('string');
    expect(typeof wallet.privateKey).toBe('string');
  });

  it('generateWalletFromMnemonic', () => {
    const wallet = generateWalletFromMnemonic({
      mnemonic:
        'mushroom deliver work spray hire nuclear wrong deputy march six midnight outside motor differ adult',
      cluster: 'testnet',
      network: 'waves',
    });

    expect(typeof wallet).toBe('object');
    expect(typeof wallet.address).toBe('string');
    expect(typeof wallet.mnemonic).toBe('string');
    expect(typeof wallet.privateKey).toBe('string');
    expect(wallet.address).toBe('3NBE5tjbQn9BHczjD6NSSuFDKVHKsBRzTv9');
  });

  it('getAddressFromPrivateKey', () => {
    const address = getAddressFromPrivateKey({
      privateKey:
        'mushroom deliver work spray hire nuclear wrong deputy march six midnight outside motor differ adult',
      network: 'waves',
    });

    expect(typeof address).toBe('object');
    expect(typeof address.address).toBe('string');
    expect(address.address).toBe('3NBE5tjbQn9BHczjD6NSSuFDKVHKsBRzTv9');
  });

  it('getBalance WAVES', async () => {
    const data = await getBalance({
      network: 'waves',
      address: '3NBE5tjbQn9BHczjD6NSSuFDKVHKsBRzTv9',
      rpcUrl: 'https://nodes-testnet.wavesnodes.com',
    });

    expect(typeof data).toBe('object');
    expect(typeof data.balance).toBe('number');
  });

  it('getBalance token', async () => {
    const data = await getBalance({
      network: 'waves',
      address: '3NBE5tjbQn9BHczjD6NSSuFDKVHKsBRzTv9',
      rpcUrl: 'https://nodes-testnet.wavesnodes.com',
      tokenAddress: '39pnv8FVf3BX3xwtC6uhFxffy2sE3seXCPsf25eNn6qG',
    });

    expect(typeof data).toBe('object');
    expect(typeof data.balance).toBe('number');
  });

  it('transfer WAVES', async () => {
    const response = await transfer({
      recipientAddress: '3N4x4ML4D6fiU18Tpw86puRoN78FCTs9VQu',
      amount: 0.0001,
      network: 'waves',
      rpcUrl: 'https://nodes-testnet.wavesnodes.com',
      privateKey:
        'mushroom deliver work spray hire nuclear wrong deputy march six midnight outside motor differ adult',
    });

    expect(typeof response).toBe('object');

    expect(response.assetId).toBe(null);
    expect(typeof response.id).toBe('string');
    expect(typeof response.sender).toBe('string');
    expect(typeof response.recipient).toBe('string');
  });

  it('transfer Token on Waves', async () => {
    const response = await transfer({
      recipientAddress: '3N4x4ML4D6fiU18Tpw86puRoN78FCTs9VQu',
      tokenAddress: '39pnv8FVf3BX3xwtC6uhFxffy2sE3seXCPsf25eNn6qG',
      amount: 1,
      network: 'waves',
      rpcUrl: 'https://nodes-testnet.wavesnodes.com',
      privateKey:
        'mushroom deliver work spray hire nuclear wrong deputy march six midnight outside motor differ adult',
    });

    expect(typeof response).toBe('object');
    expect(typeof response.id).toBe('string');
    expect(typeof response.sender).toBe('string');
    expect(typeof response.assetId).toBe('string');
    expect(typeof response.recipient).toBe('string');
  });

  it('Get transaction', async () => {
    const receipt = await getTransaction({
      rpcUrl: 'https://nodes-testnet.wavesnodes.com',
      hash: 'Barwuj1gCiQ9wCfLQ1nbdz2CSyQXLnRxnDEubtdTwJpd',
      network: 'waves',
    });

    expect(typeof receipt).toBe('object');
    expect(typeof receipt.id).toBe('string');
    expect(typeof receipt.amount).toBe('number');
    expect(typeof receipt.height).toBe('number');
    expect(typeof receipt.sender).toBe('string');
    expect(typeof receipt.chainId).toBe('number');
    expect(typeof receipt.recipient).toBe('string');
    expect(typeof receipt.timestamp).toBe('number');
    expect(Array.isArray(receipt.proofs)).toBeTruthy();
  });

  it('get WAVES token info', async () => {
    const data = await getTokenInfo({
      network: 'waves',
      rpcUrl: 'https://nodes-testnet.wavesnodes.com',
      address: '39pnv8FVf3BX3xwtC6uhFxffy2sE3seXCPsf25eNn6qG',
    });

    expect(typeof data).toBe('object');
  });

  it('call (write) to smart contract', async () => {
    const data = await smartContractCall({
      network: 'waves',
      methodType: 'write',
      rpcUrl: 'https://nodes-testnet.wavesnodes.com',
      contractAddress: '3N9uzrTiArce1h9VCqK3QUUZmFqBgg5rZSW',
      privateKey:
        'mushroom deliver work spray hire nuclear wrong deputy march six midnight outside motor differ adult',
      method: 'deposit',
      payment: [{ assetId: null, amount: 1000 }],
      params: [],
    });

    expect(typeof data).toBe('object');
  });

  it('call (read) smart contract data', async () => {
    const data = await smartContractCall({
      network: 'waves',
      methodType: 'read',
      rpcUrl: 'https://nodes-testnet.wavesnodes.com',
      contractAddress: '3N9uzrTiArce1h9VCqK3QUUZmFqBgg5rZSW',
      method: '3N1gVpA5MVY4WsMpzQ6RfcscpDDdqBbLx6n_balance',
      params: [],
    });

    expect(typeof data).toBe('object');
  });
});
