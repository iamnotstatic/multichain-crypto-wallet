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
  CreateWalletPayload,
  GetAddressFromPrivateKeyPayload,
  GenerateWalletFromMnemonicPayload,
  IResponse,
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
  if (!rpcUrl) {
    throw new Error('RPC URL is required');
  }

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

const createWallet = ({ derivationPath }: CreateWalletPayload): IResponse => {
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

const getAddressFromPrivateKey = ({
  privateKey,
}: GetAddressFromPrivateKeyPayload): IResponse => {
  const wallet = new ethers.Wallet(privateKey);

  return successResponse({
    address: wallet.address,
  });
};

const generateWalletFromMnemonic = ({
  mnemonic,
  derivationPath,
}: GenerateWalletFromMnemonicPayload): IResponse => {
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
}: BalancePayload): Promise<IResponse> => {
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
}: TransferPayload): Promise<IResponse> => {
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

const getTransaction = async ({ hash, rpcUrl }: GetTransactionPayload): Promise<IResponse> => {
  const { providerInstance } = await getContract({ rpcUrl });

  try {
    const tx = await providerInstance.getTransactionReceipt(hash);
    return successResponse({
      ...tx,
    });
  } catch (error) {
    throw error;
  }
};

const getEncryptedJsonFromPrivateKey = async (
  args: GetEncryptedJsonFromPrivateKey
): Promise<IResponse> => {
  const wallet = new ethers.Wallet(args.privateKey);
  const json = await wallet.encrypt(args.password);

  return successResponse({ json });
};

const getWalletFromEncryptedJson = async (
  args: GetWalletFromEncryptedjsonPayload
): Promise<IResponse> => {
  const wallet = await ethers.Wallet.fromEncryptedJson(
    args.json,
    args.password
  );

  return successResponse({
    privateKey: wallet.privateKey,
    address: wallet.address,
  });
};

const getTokenInfo = async ({ address, rpcUrl }: IGetTokenInfoPayload): Promise<IResponse> => {
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
      totalSupply: ethers.utils.formatUnits(totalSupply, decimals).toString(),
    };
    return successResponse({ ...data });
  }

  throw new Error('Contract not found');
};

const smartContractCall = async (args: ISmartContractCallPayload): Promise<IResponse> => {
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
