import provider from '../utils/ethers';
import erc20Abi from '../../abis/erc20.json';
import { ethers } from 'ethers';
import { TransferPayload } from '../utils/types';

export const getContract = async (
  rpcUrl: string,
  privateKey?: string,
  tokenAddress?: string
) => {
  const providerInstance = provider(rpcUrl, privateKey);
  const gasPrice = await providerInstance.getGasPrice();
  const gas = ethers.BigNumber.from(21000);

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
    gas,
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

export const transfer = async (args: TransferPayload) => {
  const {
    contract,
    providerInstance,
    gasPrice,
    gas,
    nonce,
  } = await getContract(args.rpcUrl, args.privateKey, args.tokenAddress);

  let wallet = new ethers.Wallet(args.privateKey, providerInstance);

  try {
    let tx;

    if (contract) {
      const decimals = await contract.decimals();

      tx = await contract.transfer(
        args.toAddress,
        ethers.utils.parseUnits(args.amount.toString(), decimals),
        {
          gasPrice:
            ethers.utils.parseUnits(args.gasPrice as string, 'gwei') ||
            gasPrice,
          nonce: args.nonce || nonce,
        }
      );
    } else {
      tx = await wallet.sendTransaction({
        to: args.toAddress,
        value: ethers.utils.parseEther(args.amount.toString()),
        gasPrice:
          ethers.utils.parseUnits(args.gasPrice as string, 'gwei') || gasPrice,
        gasLimit: gas,
        nonce: args.nonce || nonce,
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
