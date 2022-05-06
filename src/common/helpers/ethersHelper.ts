import provider from '../utils/ethers';
import erc20Abi from '../../abis/erc20.json';
import { ethers } from 'ethers';
import {
  BalancePayload,
  GetAddressFromPrivateKeyPayload,
  GetEncryptedJsonFromPrivateKey,
  GetTransactionPayload,
  GetWalletFromEncryptedjsonPayload,
  TransferPayload,
  IGetTokenMetadataPayload,
} from '../utils/types';
import { successResponse } from '../utils';

interface GetContract {
  rpcUrl: string;
  privateKey?: string;
  tokenAddress?: string;
}

const getContract = async ({
  tokenAddress,
  rpcUrl,
  privateKey,
}: GetContract) => {
  const providerInstance = provider(rpcUrl);
  const gasPrice = await providerInstance.getGasPrice();
  const gas = ethers.BigNumber.from(21000);

  let nonce;
  let contract;
  let signer;

  if (privateKey && tokenAddress) {
    signer = new ethers.Wallet(privateKey, providerInstance);
    nonce = providerInstance.getTransactionCount(signer.getAddress());
    contract = new ethers.Contract(tokenAddress, erc20Abi, signer);
  } else if (privateKey && !tokenAddress) {
    signer = new ethers.Wallet(privateKey, providerInstance);
    nonce = providerInstance.getTransactionCount(signer.getAddress());
  } else if (tokenAddress && !privateKey) {
    contract = new ethers.Contract(tokenAddress, erc20Abi, providerInstance);
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

const getBalance = async ({
  rpcUrl,
  tokenAddress,
  address,
}: BalancePayload) => {
  const { contract, providerInstance } = await getContract({
    rpcUrl,
    tokenAddress,
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

const createWallet = async (derivationPath?: string) => {
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

const getAddressFromPrivateKey = async (
  args: GetAddressFromPrivateKeyPayload
) => {
  const wallet = new ethers.Wallet(args.privateKey);

  return successResponse({
    address: wallet.address,
  });
};

const generateWalletFromMnemonic = async (
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
const transfer = async ({
  privateKey,
  tokenAddress,
  rpcUrl,
  ...args
}: TransferPayload) => {
  const {
    contract,
    providerInstance,
    gasPrice,
    gas,
    nonce,
  } = await getContract({ rpcUrl, privateKey, tokenAddress });

  let wallet = new ethers.Wallet(privateKey, providerInstance);

  try {
    let tx;

    if (contract) {
      const decimals = await contract.decimals();

      tx = await contract.transfer(
        args.recipientAddress,
        ethers.utils.parseUnits(args.amount.toString(), decimals),
        {
          gasPrice: args.gasPrice
            ? ethers.utils.parseUnits(args.gasPrice.toString(), 'gwei')
            : gasPrice,
          nonce: args.nonce || nonce,
        }
      );
    } else {
      tx = await wallet.sendTransaction({
        to: args.recipientAddress,
        value: ethers.utils.parseEther(args.amount.toString()),
        gasPrice: args.gasPrice
          ? ethers.utils.parseUnits(args.gasPrice.toString(), 'gwei')
          : gasPrice,
        gasLimit: gas,
        nonce: args.nonce || nonce,
      });
    }

    return successResponse({
      hash: tx.hash,
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
      receipt: tx,
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

const getTokenMetadata = async ({
  address,
  rpcUrl,
}: IGetTokenMetadataPayload) => {
  const { contract } = await getContract({ tokenAddress: address, rpcUrl });

  if (contract) {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply(),
    ]);

    return successResponse({
      name,
      symbol,
      decimals,
      address: contract.address,
      totalSupply: parseInt(ethers.utils.formatUnits(totalSupply, decimals)),
    });
  }

  return;
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
  getTokenMetadata,
};
