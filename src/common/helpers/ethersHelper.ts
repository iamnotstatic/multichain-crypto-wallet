import provider from '../utils/ethers';
import erc20Abi from '../../abis/erc20.json';
import { ethers } from 'ethers';

export const getContract = async (
  rpcUrl: string,
  privateKey?: string,
  tokenAddress?: string
) => {
  const providerInstance = provider(rpcUrl, privateKey);
  const gasPrice = await providerInstance.getGasPrice();

  const signer = providerInstance.getSigner();

  let nonce;
  let contract;

  if (tokenAddress) {
    nonce = providerInstance.getTransactionCount(signer.getAddress());
    contract = new ethers.Contract(tokenAddress, erc20Abi, signer);
  }

  return {
    contract,
    signer,
    gasPrice,
    nonce,
    providerInstance,
  };
};

export const getBalance = async (
  rpcUrl: string,
  address: string,
  privateKey?: string,
  tokenAddress?: string
) => {
  const { contract, providerInstance } = await getContract(
    rpcUrl,
    privateKey,
    tokenAddress
  );

  try {
    let balance;

    if (contract) {
      const decimals = await contract.decimals();

      balance = await contract.balanceOf(`${address}`);
      return ethers.utils.formatUnits(balance, decimals);
    }

    balance = await providerInstance.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const createEthereumWallet = async () => {
  const wallet = ethers.Wallet.createRandom();

  return {
    privateKey: wallet.privateKey,
    address: wallet.address,
    mnemonic: wallet.mnemonic.phrase,
  };
};

export const transfer = async (
  rpcUrl: string,
  privateKey: string,
  toAddress: string,
  amount: number,
  tokenAddress?: string
) => {
  const { contract, providerInstance, gasPrice, nonce } = await getContract(
    rpcUrl,
    privateKey,
    tokenAddress
  );

  let wallet = new ethers.Wallet(privateKey, providerInstance);

  try {
    let tx;

    if (contract) {
      const decimals = await contract.decimals();

      tx = await contract.transfer(
        toAddress,
        ethers.utils.parseUnits(amount.toString(), decimals),
        {
          gasPrice,
          nonce,
        }
      );
    } else {
      tx = await wallet.sendTransaction({
        to: toAddress,
        value: ethers.utils.parseEther(amount.toString()),
        gasPrice,
        nonce,
      });
    }

    return {
      hash: tx.hash,
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};
