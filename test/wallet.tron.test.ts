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

describe('MultichainCryptoWallet Tron tests', () => {
  it('generateMnemonic', () => {
    const mnemonic = generateMnemonic();

    expect(mnemonic).toBeDefined();
  });

  it('createWallet', () => {
    const wallet = createWallet({
      network: 'tron',
      derivationPath: "m/44'/195'/0'/0/0",
    });
    expect(wallet).toBeDefined();
  });

  it('generateWalletFromMnemonic', () => {
    const wallet = generateWalletFromMnemonic({
      mnemonic:
        'crop traffic saddle addict foster split make luxury scissors daughter bike exit',
      network: 'tron',
    });
    expect(wallet).toBeDefined();
  });

  it('getAddressFromPrivateKey', () => {
    const address = getAddressFromPrivateKey({
      privateKey:
        'fa01dc6efd5fd64e4897aadf255ae715cf34138c7ada5f6a7efb0bdd0bd9c8c4',
      network: 'tron',
    });
    expect(address).toBeDefined();
  });

  it('getBalance TRX balance', async () => {
    const balance = await getBalance({
      rpcUrl: 'https://nile.trongrid.io',
      address: 'TDdHvW9nU1JaX1P7roYtDvjErTTR17GPJJ',
      network: 'tron',
    });
    expect(balance).toBeDefined();
    expect(typeof balance.balance).toBe('string');
  });

  it('getBalance TRC20 token balance', async () => {
    const balance = await getBalance({
      rpcUrl: 'https://nile.trongrid.io',
      address: 'TEVuGfgLkQCVXs7EtjMiQp3ZSSUkEbNnVS',
      network: 'tron',
      tokenAddress: 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj',
    });
    expect(balance).toBeDefined();
    expect(typeof balance.balance).toBe('string');
  });

  it('transfer TRX', async () => {
    const tx = await transfer({
      rpcUrl: 'https://nile.trongrid.io',
      recipientAddress: 'TEVuGfgLkQCVXs7EtjMiQp3ZSSUkEbNnVS',
      amount: 0.0001,
      network: 'tron',
      privateKey:
        'fa01dc6efd5fd64e4897aadf255ae715cf34138c7ada5f6a7efb0bdd0bd9c8c4',
    });

    expect(tx).toBeDefined();
    expect(tx.txid).toBeDefined();
  });

  it('transfer TRC20 token', async () => {
    const tx = await transfer({
      rpcUrl: 'https://nile.trongrid.io',
      recipientAddress: 'TEVuGfgLkQCVXs7EtjMiQp3ZSSUkEbNnVS',
      privateKey:
        'fa01dc6efd5fd64e4897aadf255ae715cf34138c7ada5f6a7efb0bdd0bd9c8c4',
      amount: 0.1,
      network: 'tron',
      tokenAddress: 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj',
    });

    expect(tx).toBeDefined();
    expect(tx.txid).toBeDefined();
  });

  it('getTransaction by hash', async () => {
    const tx = await getTransaction({
      hash: '34f27486cbe693d5182c4b5e18c1779d918668f86f396ed62a279d8b519b81cc',
      network: 'tron',
      rpcUrl: 'https://nile.trongrid.io',
    });

    expect(tx).toBeDefined();
  });

  it('getTokenInfo TRC20 token', async () => {
    const data = await getTokenInfo({
      address: 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj',
      network: 'tron',
      rpcUrl: 'https://nile.trongrid.io',
    });

    expect(typeof data).toBe('object');
    expect(typeof (data && data.name)).toBe('string');
    expect(typeof (data && data.symbol)).toBe('string');
    expect(typeof (data && data.address)).toBe('string');
    expect(typeof (data && data.decimals)).toBe('number');
    expect(typeof (data && data.totalSupply)).toBe('string');
  });

  it('smartContractCall write TRC20 token transfer', async () => {
    const { data } = await smartContractCall({
      network: 'tron',
      rpcUrl: 'https://nile.trongrid.io',
      contractAddress: 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj',
      method: 'transfer(address,uint256)',
      methodType: 'write',
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
      params: [
        { type: 'address', value: 'TEVuGfgLkQCVXs7EtjMiQp3ZSSUkEbNnVS' },
        { type: 'uint256', value: 1000000 },
      ],
      privateKey:
        'fa01dc6efd5fd64e4897aadf255ae715cf34138c7ada5f6a7efb0bdd0bd9c8c4',
    });

    expect(data).toBeDefined();
    expect(data.txid).toBeDefined();
  });

  it('smartContractCall read TRC20 token balance', async () => {
    const { data } = await smartContractCall({
      network: 'tron',
      rpcUrl: 'https://nile.trongrid.io',
      contractAddress: 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj',
      method: 'balanceOf',
      methodType: 'read',
      contractAbi: [
        {
          constant: true,
          inputs: [{ name: '_owner', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ name: 'balance', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
      ],
      params: [
        { type: 'address', value: 'TEVuGfgLkQCVXs7EtjMiQp3ZSSUkEbNnVS' },
      ],
    });

    expect(data).toBeDefined();
    expect(typeof data).toBe('string');
  });
});
