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
