import { TronWeb, utils } from 'tronweb';
import { successResponse } from '../utils';
import erc20Abi from '../../abis/erc20.json';
import {
  BalancePayload,
  GetTransactionPayload,
  IGetTokenInfoPayload,
  ISmartContractCallPayload,
  TransferPayload,
} from '../utils/types';

interface GetContract {
  rpcUrl?: string;
  apiKey?: string;
  privateKey?: string;
  contractAddress?: string;
  abi?: any[];
}

const getContract = async ({
  contractAddress,
  rpcUrl,
  apiKey,
  privateKey,
  abi,
}: GetContract) => {
  if (!rpcUrl) {
    throw new Error('RPC URL is required');
  }

  let tronWeb = new TronWeb({
    fullHost: rpcUrl,
    headers: apiKey ? { 'TRON-PRO-API-KEY': apiKey } : undefined,
  });

  if (privateKey) {
    tronWeb.setPrivateKey(privateKey);
  }

  let contract;
  if (contractAddress) {
    if (privateKey) {
      const wallet = TronWeb.address.fromPrivateKey(privateKey);
      tronWeb.setAddress(wallet as string);
    } else {
      tronWeb.setAddress(contractAddress);
    }

    contract = tronWeb.contract(abi || erc20Abi, contractAddress);
  }

  return {
    contract,
    tronWeb,
  };
};

const createWallet = (derivationPath?: string) => {
  const path = derivationPath || "m/44'/195'/0'/0/0";
  const account = TronWeb.createRandom(undefined, path);

  return successResponse({
    address: account.address,
    privateKey: account.privateKey,
    mnemonic: account.mnemonic?.phrase,
  });
};

const getAddressFromPrivateKey = (privateKey: string) => {
  const account = TronWeb.address.fromPrivateKey(privateKey);

  return successResponse({
    address: account,
  });
};

const generateWalletFromMnemonic = (
  mnemonic: string,
  derivationPath?: string
) => {
  const path = derivationPath || "m/44'/195'/0'/0/0";
  const account = TronWeb.fromMnemonic(mnemonic, path);

  const privateKey = account.privateKey.startsWith('0x')
    ? account.privateKey.substring(2)
    : account.privateKey;

  return successResponse({
    address: account.address,
    privateKey: privateKey,
    mnemonic: mnemonic,
  });
};

const getBalance = async ({
  rpcUrl,
  tokenAddress,
  address,
}: BalancePayload) => {
  const { tronWeb, contract } = await getContract({
    rpcUrl,
    contractAddress: tokenAddress,
  });

  try {
    if (contract && tokenAddress) {
      const balance = await contract.methods.balanceOf(address).call();

      return successResponse({
        balance: TronWeb.fromSun(Number(balance)),
      });
    }

    const balance = await tronWeb.trx.getBalance(address);

    return successResponse({
      balance: TronWeb.fromSun(balance).toString(),
    });
  } catch (error) {
    throw error;
  }
};

const transfer = async ({
  privateKey,
  tokenAddress,
  rpcUrl,
  recipientAddress,
  amount,
  feeLimit,
}: TransferPayload) => {
  const { tronWeb, contract } = await getContract({
    rpcUrl,
    privateKey,
    contractAddress: tokenAddress,
  });

  try {
    let tx;

    if (contract && tokenAddress) {
      const amountInSun = TronWeb.toSun(amount);
      const functionSelector = 'transfer(address,uint256)';
      const parameter = [
        { type: 'address', value: recipientAddress },
        { type: 'uint256', value: amountInSun.toString() },
      ];

      const txRaw = await tronWeb.transactionBuilder.triggerSmartContract(
        tokenAddress,
        functionSelector,
        feeLimit ? { feeLimit } : {},
        parameter
      );
      const signedTx = await tronWeb.trx.sign(txRaw.transaction);
      const result = await tronWeb.trx.sendRawTransaction(signedTx);

      tx = result;
    } else {
      const amountInSun = TronWeb.toSun(amount);
      tx = await tronWeb.trx.sendTransaction(
        recipientAddress,
        Number(amountInSun.toString())
      );
    }

    return successResponse({
      ...tx,
    });
  } catch (error) {
    throw error;
  }
};

const getTransaction = async ({ hash, rpcUrl }: GetTransactionPayload) => {
  const { tronWeb } = await getContract({ rpcUrl });

  try {
    const tx = await tronWeb.trx.getTransactionInfo(hash);
    return successResponse({
      ...tx,
    });
  } catch (error) {
    throw error;
  }
};

const getTokenInfo = async ({
  address,
  rpcUrl,
  apiKey,
}: IGetTokenInfoPayload) => {
  const { contract } = await getContract({
    contractAddress: address,
    rpcUrl,
    apiKey,
  });

  if (contract) {
    try {
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.methods.name().call(),
        contract.methods.symbol().call(),
        contract.methods.decimals().call(),
        contract.methods.totalSupply().call(),
      ]);

      const data = {
        name,
        symbol,
        decimals: Number(decimals),
        address,
        totalSupply: TronWeb.fromSun(Number(totalSupply)).toString(),
      };

      return successResponse({ ...data });
    } catch (error) {
      throw error;
    }
  }

  throw new Error('Contract not found');
};

const smartContractCall = async ({
  rpcUrl,
  contractAddress,
  privateKey,
  method,
  params = [],
  methodType,
  feeLimit,
  contractAbi,
}: ISmartContractCallPayload) => {
  const { tronWeb } = await getContract({
    rpcUrl,
    contractAddress,
    privateKey,
  });

  try {
    if (!contractAbi) {
      throw new Error('Contract ABI is required');
    }

    let result;

    if (methodType === 'read') {
      const functionAbi = contractAbi.find(abi => abi.name === method);
      const functionSelector = `${functionAbi.name}(${functionAbi.inputs
        .map((input: { type: string }) => input.type)
        .join(',')})`;

      result = await tronWeb.transactionBuilder.triggerConstantContract(
        contractAddress,
        functionSelector,
        {},
        params
      );

      const prefixedHex = result.constant_result[0].startsWith('0x')
        ? result.constant_result[0]
        : `0x${result.constant_result[0]}`;

      const decoded = utils.abi.decodeParamsV2ByABI(functionAbi, prefixedHex);
      result = decoded.toString();
    } else if (methodType === 'write') {
      const txRaw = await tronWeb.transactionBuilder.triggerSmartContract(
        contractAddress,
        method,
        feeLimit ? { feeLimit } : {},
        params
      );
      const signedTx = await tronWeb.trx.sign(txRaw.transaction);
      result = await tronWeb.trx.sendRawTransaction(signedTx);
    }

    return successResponse({
      data: result,
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
  getTokenInfo,
  smartContractCall,
};
