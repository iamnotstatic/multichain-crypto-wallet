# Multi-chain Crypto Wallet SDK

A Multichain crypto wallet SDK that supports Ethereum, BSC and Solana blockchain.

## Installation

```bash
npm install multichain-crypto-wallet
```
Using yarn,
    
 ```bash
yarn add multichain-crypto-wallet
```

## Usage

```javascript
// Import the library
import MultichainCryptoWallet from "multichain-crypto-wallet";
```


## Methods
The following methods are available with this SDK:

- [Create Wallet](#create-wallet)
- [Get Balance](#get-balance)
- [Generate Wallet from Mnemonic](#generate-wallet-from-mnemonic)
- [Get Address from Private Key](#get-address-from-private-key)
- [Get Transaction with Hash](#get-transaction-with-hash)
- [Transfer](#transfer)



### Create Wallet

This method creates a new wallet. The method accepts a payload object as the parameter. The parameter of this payload is:

```javascript
// Creating an Ethereum wallet.
const wallet = await MultichainCryptoWallet.createWallet({
  network: "ethereum",
});

// Creating a Solana wallet.
const wallet = await MultichainCryptoWallet.createWallet({
  network: "solana",
});
```

#### Repsonse

```javascript
    {
      address: '0xfBE11AC0258cc8288cA24E818691Eb062f7042E9',
      privateKey: '0xfdf745f45d1942feea79b4c0a3fc1ca67da366899f7e6cebaa06496806ca8127',
      mnemonic: 'net idle lava mango another capable inhale portion blossom fluid discover cruise'
    }
```

### Get Balance

This gets the balance of the address passed in. The method accepts a payload object as the parameter. The parameters for this object depeding on the kind of balance to be gotten is in the form:

#### Native coins 
```javascript
// Get the balance of the ETH network address
const data = await MultichainCryptoWallet.getBalance({
  address: "0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22",
  network: "ethereum",
  rpcUrl: "https://rpc.ankr.com/eth",
});

// Get the balance of the SOL network address
const data = await MultichainCryptoWallet.getBalance({
  address: "DYgLjazTY6kMqagbDMsNttRHKQj9o6pNS8D6jMjWbmP7",
  network: "solana",
  rpcUrl: "https://rpc.ankr.com/solana",
});
```
#### Tokens
```javascript
// Get the balance of an ERC20 token.
const data = await MultichainCryptoWallet.getBalance({
  address: "0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22",
  network: "ethereum",
  rpcUrl: "https://rpc.ankr.com/eth",
  tokenAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
});

// Get the balance of a Solana token.
const data = await MultichainCryptoWallet.getBalance({
  address: "5PwN5k7hin2XxUUaXveur7jSe5qt2mkWinp1JEiv8xYu",
  tokenAddress: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  network: "solana",
  rpcUrl: "https://rpc.ankr.com/solana",
});
```

#### Repsonse 

```javascript
{
  balance: 2;
}
```

### Generate Wallet from Mnemonic

This generates a new wallet from the key phrase. The method accepts a payload object as the parameter. The parameters that this payload takes are:

```javascript
// Generate an Ethereum wallet from the mnemonic.
const wallet = await MultichainCryptoWallet.generateWalletFromMnemonic({
  mnemonic:
    "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat",
  network: "ethereum",
});

// Generate a Solana wallet from the mnemonic.
const wallet = await MultichainCryptoWallet.generateWalletFromMnemonic({
  mnemonic:
    "base dry mango subject neither labor portion weekend range couple right document",
  network: "solana",
});
```

#### Repsonse

```javascript
    {
      address: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
      privateKey: '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
      mnemonic: 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'
    }
```

### Get Address from Private Key

This gets the address from the private key passed in. The method accepts a payload object as the parameter. The parameters that this payload takes are:

```javascript
// Get the address from the private key of the ETH network.
const address = await MultichainCryptoWallet.getAddressFromPrivateKey({
  privateKey:
    "0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad",
  network: "ethereum",
});

// Get the address from the private key of the SOL network.
const address = await MultichainCryptoWallet.getAddressFromPrivateKey({
  privateKey:
    "bXXgTj2cgXMFAGpLHkF5GhnoNeUpmcJDsxXDhXQhQhL2BDpJumdwMGeC5Cs66stsN3GfkMH8oyHu24dnojKbtfp",
  network: "solana",
});
```

#### Repsonse 

```javascript
{
  address: "0x1C082D1052fb44134a408651c01148aDBFcCe7Fe";
}
```

### Get Transaction with Hash 
This gets the transcation receipt of a transaction from the transaction hash and network. The method accepts a payload object as the parameter. The parameters that this payload takes are:

```javascript
// Get the transaction receipt of an ETH transaction.
const payload = {
      rpcUrl: 'https://rinkeby-light.eth.linkpool.io',
      hash:
        '0x5a90cea37e3a5dbee6e10190ff5a3769ad27a0c6f625458682104e26e0491055',
      network: 'ethereum',
};
const receipt = await MultichainCryptoWallet.getTransaction(payload);

// Get the transaction receipt of a SOL transaction.
const payload = {
      rpcUrl: 'https://api.devnet.solana.com'',
      hash:
        'CkG1ynQ2vN8bmNsBUKG8ix3moUUfELWwd8K2f7mmqDd7LifFFfgyFhBux6t22AncbY4NR3PsEU3DbH7mDBMXWk7',
      network: 'solana',
};
const receipt = await MultichainCryptoWallet.getTransaction(payload);
```

#### Response

``` javascript
{
    receipt: { object }
}
```


### Transfer

This transfers the amount of tokens from the source address to the destination address It takes in the payload object as the parameter. It allows for the transfer of the following:

#### ETH

Allows for the transfer of ETH, native tokens, and overriding of transactions.

```javascript
// Transferring ETH from one address to another.
const payload = {
  recipientAddress: "0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22",
  amount: 0.0001,
  network: "ethereum",
  rpcUrl: "https://rpc.ankr.com/eth",
  privateKey:
    "0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad",
  gasPrice: "10", // Optional - leave empty for default
};
const transfer = await MultichainCryptoWallet.transfer(payload);

// Transferring ERC20 tokens from one address to another.
const payload = {
  recipientAddress: "0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22",
  amount: 10,
  network: "ethereum",
  rpcUrl: "https://rpc.ankr.com/eth",
  privateKey:
    "0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad",
  gasPrice: "10", // Optional - leave empty for default
  tokenAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
};
const transfer = await MultichainCryptoWallet.transfer(payload);
```

The optional parameters that the payload takes in are: gas price, token address, and nonce. 

- The gas price is the price of gas in Gwei. The higher the gas price, the faster the transaction will be. It's best to use a higher gas price than the default.
- The token address is the address of the token contract. 
- The nonce is the number of transactions that have been sent from the source address and is used to ensure that the transaction is unique. The transaction is unique because the nonce is incremented each time a transaction is sent. 

```javascript
// Overriding pending ETH transactions.
const payload = {
  recipientAddress: "0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22",
  amount: 0,
  network: "ethereum",
  rpcUrl: "https://rpc.ankr.com/eth",
  privateKey:
    "0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad",
  gasPrice: "10",
  nonce: 1,
};

// Overriding ERC20 token pending transaction on Ethereum.
const payload = {
  recipientAddress: "0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22",
  amount: 0,
  network: "ethereum",
  rpcUrl: "https://rpc.ankr.com/eth",
  privateKey:
    "0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad",
  gasPrice: "10",
  tokenAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  nonce: 1,
};

const transfer = await MultichainCryptoWallet.transfer(payload);

```
#### Response

``` javascript
{
    hash: '5ZAYTLj2WbkUumYoSBuQG8aDE4m5TzqDAMoSMDzcZfJyBgoxiWgm9GYm8Khid9dECCWPuQWhpb1rQiMrMBuvxLZw'
}
```

#### SOLANA
Allows for the transfer of SOL and Solana native tokens. 

``` javascript
// Transferring SOL from one address to another.
const payload = {
  recipientAddress: "9DSRMyr3EfxPzxZo9wMBPku7mvcazHTHfyjhcfw5yucA",
  amount: 1,
  network: "solana",
  rpcUrl: "https://rpc.ankr.com/solana",
  privateKey:
    "bXXgTj2cgXMFAGpLHkF5GhnoNeUpmcJDsxXDhXQhQhL2BDpJumdwMGeC5Cs66stsN3GfkMH8oyHu24dnojKbtfp",
};

const transfer = await MultichainCryptoWallet.transfer(payload);

// Transferring a Solana Token from one address to another.
const payload = {
  recipientAddress: "9DSRMyr3EfxPzxZo9wMBPku7mvcazHTHfyjhcfw5yucA",
  tokenAddress: "DV2exYApRFWEVb9oQkedLRYeSm8ccxNReLfEksEE5FZm",
  amount: 1,
  network: "solana",
  rpcUrl: "https://rpc.ankr.com/solana",
  privateKey:
    "h5KUPKU4z8c9nhMCQsvCLq4q6Xn9XK1B1cKjC9bJVLQLgJDvknKCBtZdHKDoKBHuATnSYaHRvjJSDdBWN8P67hh",
};

const transfer = await MultichainCryptoWallet.transfer(payload);
```

#### Response

``` javascript
{
    hash: '3nGq2yczqCpm8bF2dyvdPtXpnFLJ1oGWkDfD6neLbRay8SjNqYNhWQBKE1ZFunxvFhJ47FyT6igNpYPP293jXCZk'
}
```

Contirubtions are welcome! Kindly refer to the contribution guidelines.