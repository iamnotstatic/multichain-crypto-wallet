# Multichain Crypto Wallet

A Multichain crypto wallet library that supports Ethereum, Bitcoin, Solana, Waves and other EVM compatible blockchains E.g. Binance Smart Chain, Polygon, Avalanche etc.

[![Build](https://img.shields.io/github/actions/workflow/status/iamnotstatic/multichain-crypto-wallet/main.yml)](https://github.com/iamnotstatic/multichain-crypto-wallet)
[![Version](https://img.shields.io/npm/v/multichain-crypto-wallet)](https://github.com/iamnotstatic/multichain-crypto-wallet)
[![GitHub issues](https://img.shields.io/github/issues/iamnotstatic/multichain-crypto-wallet)](https://github.com/iamnotstatic/multichain-crypto-wallet/issues)
[![GitHub stars](https://img.shields.io/github/stars/iamnotstatic/multichain-crypto-wallet)](https://github.com/iamnotstatic/multichain-crypto-wallet/stargazers)
[![GitHub license](https://img.shields.io/github/license/iamnotstatic/multichain-crypto-wallet)](https://github.com/iamnotstatic/multichain-crypto-wallet)
[![Total Downloads](https://img.shields.io/npm/dm/multichain-crypto-wallet)](https://github.com/iamnotstatic/multichain-crypto-wallet)

## Installation

```bash
npm install multichain-crypto-wallet
```

Using yarn,

```bash
yarn add multichain-crypto-wallet
```

## Usage

### Javascript

```javascript
const multichainWallet = require('multichain-crypto-wallet');
```

### TypeScript

```typescript
import * as multichainWallet from 'multichain-crypto-wallet';
```

## Methods

The following methods are available with this SDK:

- [Multichain Crypto Wallet](#multichain-crypto-wallet)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Javascript](#javascript)
    - [TypeScript](#typescript)
  - [Methods](#methods)
    - [Generate mnemonic](#generate-mnemonic)
      - [Response](#response)
    - [Create Wallet](#create-wallet)
      - [Response](#response)
    - [Get Balance](#get-balance)
      - [Native coins](#native-coins)
      - [Tokens](#tokens)
      - [Response](#response-1)
    - [Generate Wallet from Mnemonic](#generate-wallet-from-mnemonic)
      - [Response](#response-2)
    - [Get Address from Private Key](#get-address-from-private-key)
      - [Response](#response-3)
    - [Get Transaction](#get-transaction)
      - [Response](#response-4)
    - [Transfer](#transfer)
      - [Ethereum Network](#ethereum-network)
      - [Response](#response-5)
      - [Bitcoin Network](#bitcoin-network)
      - [Response](#response-6)
      - [Solana Network](#solana-network)
      - [Response](#response-7)
      - [Waves Network](#waves-network)
      - [Response](#response-8)
    - [Encryptions](#encryptions)
      - [Encrypt Private Key](#encrypt-private-key)
      - [Response](#response-9)
      - [Decrypt Encrypted JSON](#decrypt-encrypted-json)
      - [Response](#response-10)
    - [Token Info](#token-info)
      - [Get ERC20 Token Info](#get-erc20-token-info)
      - [Response](#response-11)
      - [Get SPL Token Info](#get-spl-token-info)
      - [Response](#response-12)
      - [Get Waves Token Info](#get-waves-token-info)
      - [Response](#response-13)
    - [Smart Contract Call](#smart-contract-call)
      - [Ethereum network](#ethereum-network-1)
      - [Waves network](#waves-network-1)
      - [Response](#response-14)
    - [Want to contribute?](#want-to-contribute)

### Generate mnemonic

This method is used to generate mnemonic. Default number of words is `12` but you can pass a number param if you want to generate more or less.

```javascript
const mnemonic = multichainWallet.generateMnemonic();

// Note: Mnemonics with less than 12 words have low entropy and may be guessed by an attacker.
```

#### Response 
```javascript
net idle lava mango another capable inhale portion blossom fluid discover cruise
```

### Create Wallet

This method creates a new wallet. The method accepts a payload object as the parameter. The parameter of this payload is:

```javascript
// Creating an Ethereum wallet.
const wallet = multichainWallet.createWallet({
  derivationPath: "m/44'/60'/0'/0/0", // Leave empty to use default derivation path
  network: 'ethereum',
}); // NOTE - Address generated will work for EVM compatible blockchains E.g. Binance smart chain, Polygon etc


// Creating a Bitcoin wallet.
const wallet = multichainWallet.createWallet({
  derivationPath: "m/44'/0'/0'/0/0", // Leave empty to use default derivation path
  network: 'bitcoin', // 'bitcoin' or 'bitcoin-testnet'
});

// Creating a Solana wallet.
const wallet = multichainWallet.createWallet({
  derivationPath: "m/44'/501'/0'/0'", // Leave empty to use default derivation path
  network: 'solana',
});

// Creating a Waves wallet.
const wallet = await multichainWallet.createWallet({
  cluster: 'testnet' // Can also be mainnet,
  network: 'waves',
});
```

#### Response

```javascript
{
  address: '0xfBE11AC0258cc8288cA24E818691Eb062f7042E9',
  privateKey: '0xfdf745f45d1942feea79b4c0a3fc1ca67da366899f7e6cebaa06496806ca8127',
  mnemonic: 'net idle lava mango another capable inhale portion blossom fluid discover cruise'
}
```

### Get Balance

This gets the balance of the address passed in. The method accepts an object as the parameter.
The parameters for this object depending on the kind of balance to be gotten is in the form:

#### Native coins

```javascript
// Get the ETH balance of an address.
const data = await multichainWallet.getBalance({
  address: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
  network: 'ethereum',
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
}); // NOTE - For otherEVM compatible blockchains all you have to do is change the rpcUrl.

// Binance Smart chain
const data = await multichainWallet.getBalance({
  address: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
  network: 'ethereum',
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
});

// Get the BTC balance of an address.
const data = await multichainWallet.getBalance({
  address: '2NAhbS79dEUeqcnbC27UppwnjoVSwET5bat',
  network: 'bitcoin-testnet', // 'bitcoin' or 'bitcoin-testnet'
});

// Get the SOL balance of an address.
const data = await multichainWallet.getBalance({
  address: 'DYgLjazTY6kMqagbDMsNttRHKQj9o6pNS8D6jMjWbmP7',
  network: 'solana',
  rpcUrl: 'https://api.devnet.solana.com',
});

// Get the WAVES balance of an address.
const data = await multichainWallet.getBalance({
  network: 'waves',
  address: '3NBE5tjbQn9BHczjD6NSSuFDKVHKsBRzTv9',
  rpcUrl: 'https://nodes-testnet.wavesnodes.com',
});
```

#### Tokens

```javascript
// Get the balance of an ERC20 token.
const data = await multichainWallet.getBalance({
  address: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
  network: 'ethereum',
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
  tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
}); // NOTE - For other EVM compatible blockchains all you have to do is change the rpcUrl.

// Get the balance of a token on Solana.
const data = await multichainWallet.getBalance({
  address: '5PwN5k7hin2XxUUaXveur7jSe5qt2mkWinp1JEiv8xYu',
  tokenAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  network: 'solana',
  rpcUrl: 'https://rpc.ankr.com/solana',
});

// Get the balance of a token on Waves.
const data = await multichainWallet.getBalance({
  network: 'waves',
  address: '3NBE5tjbQn9BHczjD6NSSuFDKVHKsBRzTv9',
  rpcUrl: 'https://nodes-testnet.wavesnodes.com',
  tokenAddress: '39pnv8FVf3BX3xwtC6uhFxffy2sE3seXCPsf25eNn6qG',
});
```

#### Response

```javascript
{
  balance: 2;
}
```

### Generate Wallet from Mnemonic

This generates a wallet from Mnemonic phrase. The method accepts an object as the parameter. The parameters that this object takes are:

```javascript
// Generate an Ethereum wallet from mnemonic.
const wallet = multichainWallet.generateWalletFromMnemonic({
  mnemonic:
    'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
  derivationPath: "m/44'/60'/0'/0/0", // Leave empty to use default derivation path
  network: 'ethereum',
}); // NOTE - Address generated will work for EVM compatible blockchains E.g. Binance smart chain, Polygon etc

// Generate a Bitcoin wallet from mnemonic.
const wallet = multichainWallet.generateWalletFromMnemonic({
  mnemonic:
    'excess quit spot inspire stereo scrap cave wife narrow era pizza typical',
  derivationPath: "m/44'/0'/0'/0/0", // Leave empty to use default derivation path
  network: 'bitcoin', // 'bitcoin' or 'bitcoin-testnet'
});

// Generate a Solana wallet from mnemonic.
const wallet = multichainWallet.generateWalletFromMnemonic({
  mnemonic:
    'base dry mango subject neither labor portion weekend range couple right document',
  derivationPath: "m/44'/501'/0'/0'", // Leave empty to use default derivation path
  network: 'solana',
});

// Generate a Waves wallet from mnemonic.
const wallet = multichainWallet.generateWalletFromMnemonic({
  mnemonic:
    'mushroom deliver work spray hire nuclear wrong deputy march six midnight outside motor differ adult',
  cluster: 'testnet',
  network: 'waves',
});
```

#### Response

```javascript
{
  address: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
  privateKey: '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
  mnemonic: 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'
}
```

### Get Address from Private Key

This gets the address from the private key passed in. The method accepts an object as the parameter. The parameters that this object takes are:

```javascript
// Get the address from the private key on the Ethereum network.
const address = multichainWallet.getAddressFromPrivateKey({
  privateKey:
    '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
  network: 'ethereum',
});

// Get the address from the private key on the Bitcoin network.
const data = multichainWallet.getAddressFromPrivateKey({
  privateKey: 'KxqTGtCMnX6oL9rxynDKCRJXt64Gm5ame4AEQcYncFhSSUxFBkeJ',
  network: 'bitcoin', // 'bitcoin' or 'bitcoin-testnet'
});

// Get the address from the private key on the Solana network.
const address = multichainWallet.getAddressFromPrivateKey({
  privateKey:
    'bXXgTj2cgXMFAGpLHkF5GhnoNeUpmcJDsxXDhXQhQhL2BDpJumdwMGeC5Cs66stsN3GfkMH8oyHu24dnojKbtfp',
  network: 'solana',
});
```

#### Response

```javascript
{
  address: '0x1C082D1052fb44134a408651c01148aDBFcCe7Fe';
}
```

### Get Transaction

This gets the transaction receipt of a transaction from the transaction hash. The method accepts an object as the parameter. The parameters that this object takes are:

```javascript
// Get the transaction receipt on Ethereum network.
const receipt = await multichainWallet.getTransaction({
  hash: '0x5a90cea37e3a5dbee6e10190ff5a3769ad27a0c6f625458682104e26e0491055',
  network: 'ethereum',
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
}); // NOTE - For other EVM compatible blockchains all you have to do is change the rpcUrl.

// Get the transaction receipt on Bitcoin network.
const receipt = await getTransaction({
  network: 'bitcoin-testnet', // 'bitcoin' or 'bitcoin-testnet'
  hash: '4f6c3661e0e6d190dbdfb6c0791396fccee653c5bf4a5249b049341c2b539ee1',
});

// Get the transaction receipt on Solana network.
const receipt = await multichainWallet.getTransaction({
  rpcUrl: 'https://api.devnet.solana.com',
  hash:
    'CkG1ynQ2vN8bmNsBUKG8ix3moUUfELWwd8K2f7mmqDd7LifFFfgyFhBux6t22AncbY4NR3PsEU3DbH7mDBMXWk7',
  network: 'solana',
});

// Get the transaction receipt on Waves network.
const receipt = await multichainWallet.getTransaction({
  rpcUrl: 'https://nodes-testnet.wavesnodes.com',
  hash: 'Barwuj1gCiQ9wCfLQ1nbdz2CSyQXLnRxnDEubtdTwJpd',
  network: 'waves',
});
```

#### Response

```javascript
{
  object;
}
```

### Transfer

This transfers the amount of tokens from the source address to the destination address It takes in an object as the parameter. It allows for the transfer of the following:

#### Ethereum Network

Allows for the transfer of ETH, and overriding of transactions.

```javascript
// Transferring ETH from one address to another.
const transfer = await multichainWallet.transfer({
  recipientAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
  amount: 1,
  network: 'ethereum',
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
  privateKey:
    '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
  gasPrice: '10', // Gas price is in Gwei. Leave empty to use default gas price
  data: 'Money for transportation', // Send a message
}); // NOTE - For other EVM compatible blockchains all you have to do is change the rpcUrl.

// Transferring ERC20 tokens from one address to another.
const transfer = await multichainWallet.transfer({
  recipientAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
  amount: 10,
  network: 'ethereum',
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
  privateKey:
    '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
  gasPrice: '10', // Gas price is in Gwei. leave empty to use default gas price
  tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
}); // NOTE - For other EVM compatible blockchains all you have to do is change the rpcUrl.
```

The optional parameters that the object takes in are: gas price, nonce, and data.

- The gas price is the price of gas in Gwei. The higher the gas price, the faster the transaction will be. It's best to use a higher gas price than the default.
- The nonce is the number of transactions that have been sent from the source address and is used to ensure that the transaction is unique. The transaction is unique because the nonce is incremented each time a transaction is sent.
- The data is a string parameter used to pass across a message through the transaction. Can only be used on transfer of ETH.

```javascript
// Overriding pending ETH transaction.
const transfer = await multichainWallet.transfer({
  recipientAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
  amount: 0,
  network: 'ethereum',
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
  privateKey:
    '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
  gasPrice: '10',
  nonce: 1, // The pending transaction nonce
  data: 'Money for feeding', // Send a message
});

// Overriding ERC20 token pending transaction.
const transfer = await multichainWallet.transfer({
  recipientAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
  amount: 0,
  network: 'ethereum',
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
  privateKey:
    '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
  gasPrice: '10',
  tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  nonce: 1, // The pending transaction nonce
});
```

#### Response

```javascript
{
  object;
}
```

#### Bitcoin Network

Allows for the transfer of BTC from one address to another.

```javascript
// Transferring BTC from one address to another.
const response = await multichainWallet.transfer({
  privateKey: 'L3tSvMViDit1GSp7mbV2xFCGv6M45kDNuSyNY9xyUxmUPBFrBkc4',
  recipientAddress: '2NAhbS79dEUeqcnbC27UppwnjoVSwET5bat',
  amount: 0.001,
  network: 'bitcoin-testnet', // 'bitcoin' or 'bitcoin-testnet'
  fee: 10000, // Optional param default value is 10000
  subtractFee: false, // Optional param default value is false
});
```

#### Response

```javascript
{
  object;
}
```

#### Solana Network

Allows for the transfer of SOL and tokens.

```javascript
// Transferring SOL from one address to another.
const transfer = await multichainWallet.transfer({
  recipientAddress: '9DSRMyr3EfxPzxZo9wMBPku7mvcazHTHfyjhcfw5yucA',
  amount: 1,
  network: 'solana',
  rpcUrl: 'https://api.devnet.solana.com',
  privateKey:
    'bXXgTj2cgXMFAGpLHkF5GhnoNeUpmcJDsxXDhXQhQhL2BDpJumdwMGeC5Cs66stsN3GfkMH8oyHu24dnojKbtfp',
});

// Transferring a token from one address to another.
const transfer = await multichainWallet.transfer({
  recipientAddress: '9DSRMyr3EfxPzxZo9wMBPku7mvcazHTHfyjhcfw5yucA',
  tokenAddress: 'DV2exYApRFWEVb9oQkedLRYeSm8ccxNReLfEksEE5FZm',
  amount: 1,
  network: 'solana',
  rpcUrl: 'https://api.devnet.solana.com',
  privateKey:
    'h5KUPKU4z8c9nhMCQsvCLq4q6Xn9XK1B1cKjC9bJVLQLgJDvknKCBtZdHKDoKBHuATnSYaHRvjJSDdBWN8P67hh',
});
```

#### Response

```javascript
{
  hash: '3nGq2yczqCpm8bF2dyvdPtXpnFLJ1oGWkDfD6neLbRay8SjNqYNhWQBKE1ZFunxvFhJ47FyT6igNpYPP293jXCZk';
}
```

#### Waves Network

Allows for the transfer of WAVES and tokens.

```javascript
// Transferring WAVES from one address to another.

const response = await multichainWallet.transfer({
  recipientAddress: '3N4x4ML4D6fiU18Tpw86puRoN78FCTs9VQu',
  amount: 0.0001,
  network: 'waves',
  rpcUrl: 'https://nodes-testnet.wavesnodes.com',
  privateKey:
    'mushroom deliver work spray hire nuclear wrong deputy march six midnight outside motor differ adult',
});

// Transferring a token from one address to another.
const transfer = await multichainWallet.transfer({
  recipientAddress: '3N4x4ML4D6fiU18Tpw86puRoN78FCTs9VQu',
  tokenAddress: '39pnv8FVf3BX3xwtC6uhFxffy2sE3seXCPsf25eNn6qG',
  amount: 1,
  network: 'waves',
  rpcUrl: 'https://nodes-testnet.wavesnodes.com',
  privateKey:
    'mushroom deliver work spray hire nuclear wrong deputy march six midnight outside motor differ adult',
});
```

#### Response

```javascript
{
  type: 4,
  id: '9CbA3dsyEvbdf52gqeBvVkjEP5zBmCQPANjguNznHryf',
  fee: 100000,
  feeAssetId: null,
  timestamp: 1661781621495,
  version: 3,
  chainId: 84,
  sender: '3NBE5tjbQn9BHczjD6NSSuFDKVHKsBRzTv9',
  senderPublicKey: '8JEFTsZfqp2Y7HpmaxqgGtiMLfsNAAq3bMkwZwGpUWPV',
  proofs: [
    '5m4DpkkYkVY4xkiMNyrNpiVUHNNAtyJrSH5UCkjWSnLTAabkCefLx6wWTFT1Xcb7K8C31H7ndZAX8mWrJLMrsqxr'
  ],
  recipient: '3N4x4ML4D6fiU18Tpw86puRoN78FCTs9VQu',
  assetId: '39pnv8FVf3BX3xwtC6uhFxffy2sE3seXCPsf25eNn6qG',
  feeAsset: null,
  amount: 100000000,
  attachment: ''
}
```

### Encryptions

#### Encrypt Private Key

It supports encryption of ethereum and other EVM compatible chains private keys.

```javascript
// encrypt private key.

const encrypted = await multichainWallet.getEncryptedJsonFromPrivateKey({
  network: 'ethereum',
  privateKey:
    '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
  password: 'walletpassword',
});
```

#### Response

```javascript
{
  json: '{"address":"1c082d1052fb44134a408651c01148adbfcce7fe","id":"abfb9f10-165a-4b7a-935d-51729f10c310","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"f3fac53ee2d76c293977d1af3a7d73bb"},"ciphertext":"c5034579cdf32d7a612c9a83801aad899abfebb7436712f363ecf89546bbcbce","kdf":"scrypt","kdfparams":{"salt":"78ff80ece5d681b1aecd829526388472d1889da233229fa5c1416e8f2035b7a8","n":131072,"dklen":32,"p":1,"r":8},"mac":"0f70eca6138ffe60b174308b6ab7a8a81a0d2b662e2cf5d8727443cf12af766c"}}';
}
```

#### Decrypt Encrypted JSON

It supports decryption of encrypted JSONs (A.K.A keystore).

```javascript
// decrypting encrypted JSON.

const decrypted = await multichainWallet.getWalletFromEncryptedJson({
  network: 'ethereum',
  json:
    '{"address":"1c082d1052fb44134a408651c01148adbfcce7fe","id":"abfb9f10-165a-4b7a-935d-51729f10c310","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"f3fac53ee2d76c293977d1af3a7d73bb"},"ciphertext":"c5034579cdf32d7a612c9a83801aad899abfebb7436712f363ecf89546bbcbce","kdf":"scrypt","kdfparams":{"salt":"78ff80ece5d681b1aecd829526388472d1889da233229fa5c1416e8f2035b7a8","n":131072,"dklen":32,"p":1,"r":8},"mac":"0f70eca6138ffe60b174308b6ab7a8a81a0d2b662e2cf5d8727443cf12af766c"}}',
  password: 'walletpassword',
});
```

#### Response

```javascript
{
  privateKey: '0x0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
  address: '0x1C082D1052fb44134a408651c01148aDBFcCe7Fe'
}

```

### Token Info

#### Get ERC20 Token Info

Allows for fetching ERC20 tokens info from compatible blockchains by the token address

```javascript
// getting token info.

const info = await multichainWallet.getTokenInfo({
  address: '0x7fe03a082fd18a80a7dbd55e9b216bcf540557e4',
  network: 'ethereum',
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
}); // NOTE - For other EVM compatible blockchains all you have to do is change the rpcUrl.
```

#### Response

```javascript
{
  name: 'Mocked USDT',
  symbol: 'USDT',
  decimals: 6,
  address: '0x7fe03a082fd18a80a7dbd55e9b216bcf540557e4',
  totalSupply: 1000000000000
}
```

#### Get SPL Token Info

Allows for fetching SPL tokens info on the solana by the token address.
Note: Token has to be available on the solana token list registry

```javascript
// getting token info.

const info = await multichainWallet.getTokenInfo({
  address: '7Xn4mM868daxsGVJmaGrYxg8CZiuqBnDwUse66s5ALmr',
  network: 'solana',
  rpcUrl: 'https://api.devnet.solana.com',
  cluster: 'devnet',
});
```

#### Response

```javascript
{
  object;
}
```

#### Get Waves Token Info

Allows for fetching Waves based asset info

```javascript
// getting token info.

const info = await multichainWallet.getTokenInfo({
  network: 'waves',
  rpcUrl: 'https://nodes-testnet.wavesnodes.com',
  address: '39pnv8FVf3BX3xwtC6uhFxffy2sE3seXCPsf25eNn6qG',
});
```

#### Response

```javascript
{
  name: 'T-BTC',
  symbol: 'T-BTC',
  address: '39pnv8FVf3BX3xwtC6uhFxffy2sE3seXCPsf25eNn6qG',
  decimals: 8,
  totalSupply: 2100000000000000
}
```

### Smart Contract Call

This can be used to make custom smart contract interaction by specifying the contract ABI and function types.

#### Ethereum network

```javascript
// Calling a read smart contract function.
const data = await multichainWallet.smartContractCall({
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
  network: 'ethereum',
  contractAddress: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
  method: 'transfer',
  methodType: 'write',
  params: ['0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22', '1000000000000000000'],
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
}); // NOTE - For other EVM compatible blockchains all you have to do is change the rpcUrl.

// calling a write smart contract function.
const data = await multichainWallet.smartContractCall({
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
  network: 'ethereum',
  contractAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
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
}); // NOTE - For other EVM compatible blockchains all you have to do is change the rpcUrl.
```

#### Waves network

```javascript
// calling a read smart contract function.
const data = await multichainWallet.smartContractCall({
  network: 'waves',
  methodType: 'read',
  rpcUrl: 'https://nodes-testnet.wavesnodes.com',
  contractAddress: '3N9uzrTiArce1h9VCqK3QUUZmFqBgg5rZSW',
  method: '3N1gVpA5MVY4WsMpzQ6RfcscpDDdqBbLx6n_balance',
  params: [],
});

// calling a write smart contract function.
const data = await multichainWallet.smartContractCall({
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
```

Some of the parameters available in this function are:

- The **method** parameter is the name of the smart contract function to be interacted with.
- The **method type** is the type of action the method is meant to perform.
- The **params** parameter is the parameter of the smart contract function if it requires any. It must be in the same order as the smart contract function. If the smart contract function does not require any parameters, leave it as an empty array.

The optional parameters that the object takes in are: value, contractAbi, gas price, gas limit, nonce, and private key.

- The **value** is the amount of ETH you want to send while interacting with the function.
- The **contractAbi** is the ABI of the smart contract. Every smart contract has an ABI that can be used to interact with the smart contract functions. If this is not specified. You can interact with all the [ERC20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) token standard functions by default.
- The **gas price** is the price of gas in Gwei. The higher the gas price, the faster the transaction gets mined. It's best to use a higher gas price than the default.
- The **gas limit** is the maximum amount of gas you are willing to pay for the transaction.
- The **nonce** is the number of transactions that have been sent from the source address and is used to ensure that the transaction is unique. The transaction is unique because the nonce is incremented each time a transaction is sent.
- The **private key** is a string parameter that can be passed to use as the signer. It is used to sign the transaction. This parameter is not needed when calling a smart contract read function.
- The **payment** (only on Waves) payment is the payment (WAVES or Waves Asset) sent to the smart contract while interacting with it. If the smart contract function does not require any payment.

#### Response

```javascript
{
  data: object;
}
```

### Want to contribute?

Contributions are welcome! Kindly refer to the [contribution guidelines](CONTRIBUTING.md).
