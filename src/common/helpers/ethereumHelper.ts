import provider from '../utils/ethers';
import erc20Abi from '../../abis/erc20.json';
import { ethers } from 'ethers';
import {
  BalancePayload,
  GetEncryptedJsonFromPrivateKey,
  GetTransactionPayload,
  GetWalletFromEncryptedjsonPayload,
  TransferPayload,
  IGetTokenInfoPayload,
  ITokenInfo,
  ISmartContractCallPayload,
} from '../utils/types';
import { successResponse } from '../utils';

interface GetContract {
  rpcUrl?: string;
  privateKey?: string;
  contractAddress?: string;
  abi?: any[];
}

const getContract = async ({
  contractAddress,
  rpcUrl,
  privateKey,
  abi,
}: GetContract) => {
  const providerInstance = provider(rpcUrl);
  const gasPrice = await providerInstance.getGasPrice();
  const gas = ethers.BigNumber.from(21000);

  let nonce;
  let contract;
  let signer;
  const contractAbi = abi || erc20Abi;

  if (privateKey && contractAddress) {
    signer = new ethers.Wallet(privateKey, providerInstance);
    nonce = providerInstance.getTransactionCount(signer.getAddress());
    contract = new ethers.Contract(contractAddress, contractAbi, signer);
  } else if (privateKey && !contractAddress) {
    signer = new ethers.Wallet(privateKey, providerInstance);
    nonce = providerInstance.getTransactionCount(signer.getAddress());
  } else if (contractAddress && !privateKey) {
    contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      providerInstance
    );
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

const createWallet = (derivationPath?: string) => {
  const path = derivationPath || "m/44'/60'/0'/0/0";
  const wallet = ethers.Wallet.createRandom({
    path,
  });

  return successResponse({
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
  });
};

const getAddressFromPrivateKey = (privateKey: string) => {
  const wallet = new ethers.Wallet(privateKey);

  return successResponse({
    address: wallet.address,
  });
};

const generateWalletFromMnemonic = (
  mnemonic: string,
  derivationPath?: string
) => {
  const path = derivationPath || "m/44'/60'/0'/0/0";
  const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);

  return successResponse({
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
  });
};

const getBalance = async ({
  rpcUrl,
  tokenAddress,
  address,
}: BalancePayload) => {
  const { contract, providerInstance } = await getContract({
    rpcUrl,
    contractAddress: tokenAddress,
  });

  try {
    let balance;

    if (contract) {
      const decimals = await contract.decimals();

      balance = await contract.balanceOf(address);

      return successResponse({
        balance: parseFloat(ethers.utils.formatUnits(balance, decimals)),
      });
    }

    balance = await providerInstance.getBalance(address);

    return successResponse({
      balance: parseFloat(ethers.utils.formatEther(balance)),
    });
  } catch (error) {
    throw error;
  }
};

const transfer = async ({
  privateKey,
  tokenAddress,
  rpcUrl,
  ...args
}: TransferPayload) => {
  const { contract, providerInstance, gasPrice, nonce } = await getContract({
    rpcUrl,
    privateKey,
    contractAddress: tokenAddress,
  });

  let wallet = new ethers.Wallet(privateKey, providerInstance);

  try {
    let tx;

    if (contract) {
      const decimals = await contract.decimals();
      const estimatedGas = await contract.estimateGas.transfer(
        args.recipientAddress,
        ethers.utils.parseUnits(args.amount.toString(), decimals)
      );

      tx = await contract.transfer(
        args.recipientAddress,
        ethers.utils.parseUnits(args.amount.toString(), decimals),
        {
          gasPrice: args.gasPrice
            ? ethers.utils.parseUnits(args.gasPrice.toString(), 'gwei')
            : gasPrice,
          nonce: args.nonce || nonce,
          gasLimit: args.gasLimit || estimatedGas,
        }
      );
    } else {
      tx = await wallet.sendTransaction({
        to: args.recipientAddress,
        value: ethers.utils.parseEther(args.amount.toString()),
        gasPrice: args.gasPrice
          ? ethers.utils.parseUnits(args.gasPrice.toString(), 'gwei')
          : gasPrice,
        nonce: args.nonce || nonce,
        data: args.data
          ? ethers.utils.hexlify(ethers.utils.toUtf8Bytes(args.data as string))
          : '0x',
      });
    }

    return successResponse({
      ...tx,
    });
  } catch (error) {
    throw error;
  }
};

const getTransaction = async ({ hash, rpcUrl }: GetTransactionPayload) => {
  const { providerInstance } = await getContract({ rpcUrl });

  try {
    const tx = await providerInstance.getTransaction(hash);
    return successResponse({
      ...tx,
    });
  } catch (error) {
    throw error;
  }
};

const getEncryptedJsonFromPrivateKey = async (
  args: GetEncryptedJsonFromPrivateKey
) => {
  const wallet = new ethers.Wallet(args.privateKey);
  const json = await wallet.encrypt(args.password);

  return successResponse({ json });
};

const getWalletFromEncryptedJson = async (
  args: GetWalletFromEncryptedjsonPayload
) => {
  const wallet = await ethers.Wallet.fromEncryptedJson(
    args.json,
    args.password
  );

  return successResponse({
    privateKey: wallet.privateKey,
    address: wallet.address,
  });
};

const getTokenInfo = async ({ address, rpcUrl }: IGetTokenInfoPayload) => {
  const { contract } = await getContract({ contractAddress: address, rpcUrl });

  if (contract) {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply(),
    ]);

    const data: ITokenInfo = {
      name,
      symbol,
      decimals,
      address: contract.address,
      totalSupply: parseInt(ethers.utils.formatUnits(totalSupply, decimals)),
    };
    return successResponse({ ...data });
  }
  return;
};

const smartContractCall = async (args: ISmartContractCallPayload) => {
  const { contract, gasPrice, nonce } = await getContract({
    rpcUrl: args.rpcUrl,
    contractAddress: args.contractAddress,
    abi: args.contractAbi,
    privateKey: args.privateKey,
  });

  try {
    let tx;
    let overrides = {} as any;

    if (args.methodType === 'read') {
      overrides = {};
    } else if (args.methodType === 'write') {
      overrides = {
        gasPrice: args.gasPrice
          ? ethers.utils.parseUnits(args.gasPrice, 'gwei')
          : gasPrice,
        nonce: args.nonce || nonce,
        value: args.value ? ethers.utils.parseEther(args.value.toString()) : 0,
      };

      if (args.gasLimit) {
        overrides.gasLimit = args.gasLimit;
      }
    }

    if (args.params.length > 0) {
      tx = await contract?.[args.method](...args.params, overrides);
    } else {
      tx = await contract?.[args.method](overrides);
    }

    return successResponse({
      data: tx,
    });
  } catch (error) {
    throw error;
  }
};

export default {
  getBalance,
  createWallet,
  getAddressFromPrivateKey,
  generateWalletFromMnemonic,
  transfer,
  getTransaction,
  getEncryptedJsonFromPrivateKey,
  getWalletFromEncryptedJson,
  getTokenInfo,
  smartContractCall,
};
