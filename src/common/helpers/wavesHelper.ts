import { successResponse } from '../utils';
import {
  BalancePayload,
  GetTransactionPayload,
  IGetTokenInfoPayload,
  ISmartContractCallPayload,
  ITokenInfo,
  TransferPayload,
} from '../utils/types';
import {
  MAIN_NET_CHAIN_ID,
  TEST_NET_CHAIN_ID,
  address,
  privateKey,
  randomSeed,
} from '@waves/ts-lib-crypto';
import {
  nodeInteraction,
  transfer as transferAsset,
  invokeScript,
  IInvokeScriptParams,
  ITransferParams,
} from '@waves/waves-transactions';
import axios from 'axios';

const WAVES_DECIMALS = 8;

const createWallet = (cluster?: string) => {
  const seed = randomSeed();
  const chainId = getChainIdWithCluster(cluster);

  return successResponse({
    address: address(seed, chainId),
    privateKey: privateKey(seed),
    mnemonic: seed,
  });
};

const generateWalletFromMnemonic = (mnemonic: string, cluster?: string) => {
  const chainId = getChainIdWithCluster(cluster);

  return successResponse({
    address: address(mnemonic, chainId),
    privateKey: privateKey(mnemonic),
    mnemonic: mnemonic,
  });
};

const getBalance = async (args: BalancePayload) => {
  try {
    if (!args.rpcUrl) {
      throw new Error('Error: Node URL is required');
    }

    if (args.tokenAddress) {
      const balance = await nodeInteraction.assetBalance(
        args.tokenAddress,
        args.address,
        args.rpcUrl
      );

      const tokenInfo = await getTokenInfo({
        address: args.tokenAddress,
        rpcUrl: args.rpcUrl,
        network: args.network,
      });

      return successResponse({
        balance: Number(balance) / Math.pow(10, tokenInfo.decimals),
      });
    }

    const balance = await nodeInteraction.balance(args.address, args.rpcUrl);

    return successResponse({
      balance: balance / Math.pow(10, WAVES_DECIMALS),
    });
  } catch (error) {
    throw error;
  }
};

const transfer = async (args: TransferPayload) => {
  try {
    if (!args.rpcUrl) {
      throw new Error('Error: Node URL is required');
    }

    let amount;
    if (args.tokenAddress) {
      const tokenInfo = await getTokenInfo({
        address: args.tokenAddress,
        rpcUrl: args.rpcUrl,
        network: args.network,
      });

      amount = args.amount * Math.pow(10, tokenInfo.decimals);
    } else {
      amount = args.amount * Math.pow(10, WAVES_DECIMALS);
    }

    const params = {
      assetId: args.tokenAddress,
      recipient: args.recipientAddress,
      amount: parseInt(String(amount)),
      chainId: getChainIdWithAddress(args.recipientAddress),
    } as ITransferParams;

    const signedTx = transferAsset(params, args.privateKey);
    const broadcastedTx = await nodeInteraction.broadcast(
      signedTx,
      args.rpcUrl
    );

    return successResponse({
      ...broadcastedTx,
    });
  } catch (error) {
    throw error;
  }
};

const getTransaction = async (args: GetTransactionPayload) => {
  try {
    if (!args.rpcUrl) {
      throw new Error('Error: Node URL is required');
    }

    const tx = await nodeInteraction.transactionById(args.hash, args.rpcUrl);

    return successResponse({
      ...tx,
    });
  } catch (error) {
    throw error;
  }
};

const getTokenInfo = async (args: IGetTokenInfoPayload) => {
  try {
    const url = new URL(`assets/details/${args.address}`, args.rpcUrl);
    const { data } = await axios.get(url.toString());

    const info: ITokenInfo = {
      name: data.name,
      symbol: data.name,
      address: data.assetId,
      decimals: data.decimals,
      totalSupply: data.quantity,
    };

    return successResponse({ ...info });
  } catch (error) {
    throw error;
  }
};

const smartContractCall = async (args: ISmartContractCallPayload) => {
  let data;

  if (args.methodType === 'write') {
    const params = {
      dApp: args.contractAddress,
      call: {
        function: args.method,
        args: [...(args.params || [])],
      },
      payment: [...(args.payment || [])],
      chainId: getChainIdWithAddress(args.contractAddress),
    } as IInvokeScriptParams;

    const signedTx = invokeScript(params, args.privateKey!);
    data = await nodeInteraction.broadcast(signedTx, args.rpcUrl);
  } else if (args.methodType === 'read') {
    const response = await nodeInteraction.accountDataByKey(
      args.method,
      args.contractAddress,
      args.rpcUrl
    );

    data = response?.value;
  }

  return successResponse({
    data,
  });
};

function getChainIdWithCluster(cluster?: string) {
  return cluster === 'testnet'
    ? TEST_NET_CHAIN_ID
    : cluster === 'mainnet'
    ? MAIN_NET_CHAIN_ID
    : undefined;
}

function getChainIdWithAddress(address: string) {
  return address.startsWith('3P') ? MAIN_NET_CHAIN_ID : TEST_NET_CHAIN_ID;
}

export default {
  getBalance,
  createWallet,
  generateWalletFromMnemonic,
  transfer,
  getTransaction,
  getTokenInfo,
  smartContractCall,
};
