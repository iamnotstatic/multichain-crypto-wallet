import provider from '../utils/sui';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { MIST_PER_SUI } from '@mysten/sui/utils';
import { Transaction } from '@mysten/sui/transactions';
import {
  BalancePayload,
  CreateWalletPayload,
  GenerateWalletFromMnemonicPayload,
  GetAddressFromPrivateKeyPayload,
  GetTransactionPayload,
  IGetTokenInfoPayload,
  ISmartContractCallPayload,
  ITokenInfo,
  IResponse,
  TransferPayload,
} from '../utils/types';
import * as bip39 from 'bip39';
import { successResponse } from '../utils';
import { PureTypeName } from '@mysten/sui/dist/cjs/bcs';

const getConnection = (rpcUrl?: string) => {
  const connection = provider(rpcUrl);
  return connection;
};

const createWallet = ({ derivationPath }: CreateWalletPayload): IResponse => {
  // default ed25519 derivation path for sui
  const path = derivationPath || "m/44'/784'/0'/0'/0'";

  const mnemonic = bip39.generateMnemonic();

  const keypair = Ed25519Keypair.deriveKeypair(mnemonic, path);

  const publicKey = keypair.getPublicKey();
  const address = publicKey.toSuiAddress();

  // get the private/secret key(Bech32-encoded, sui standard)
  const secretKey = keypair.getSecretKey();

  return successResponse({
    address: address,
    privateKey: secretKey,
    mnemonic: mnemonic,
  });
};

const generateWalletFromMnemonic = ({
  mnemonic,
  derivationPath,
}: GenerateWalletFromMnemonicPayload): IResponse => {
  const path = derivationPath || "m/44'/784'/0'/0'/0'";

  const keyPair = Ed25519Keypair.deriveKeypair(mnemonic, path);

  const publicKey = keyPair.getPublicKey();
  const address = publicKey.toSuiAddress();

  const secretKey = keyPair.getSecretKey();

  return successResponse({
    address: address,
    privateKey: secretKey,
    mnemonic: mnemonic,
  });
};

const getAddressFromPrivateKey = ({
  privateKey,
}: GetAddressFromPrivateKeyPayload): IResponse => {
  const keypair = Ed25519Keypair.fromSecretKey(privateKey, {
    skipValidation: false,
  });

  const publicKey = keypair.getPublicKey();
  const address = publicKey.toSuiAddress();

  return successResponse({
    address: address,
  });
};

const getBalance = async (args: BalancePayload): Promise<IResponse> => {
  const connection = getConnection(args.rpcUrl);

  if (args.tokenAddress) {
    const balance = await connection.getBalance({
      owner: args.address,
      coinType: args.tokenAddress,
    });

    // Fetch token metadata to get decimals
    const metadata = await connection.getCoinMetadata({
      coinType: args.tokenAddress,
    });

    const decimals = metadata ? metadata.decimals : 0;
    return successResponse({
      balance: parseFloat(balance.totalBalance) / Math.pow(10, decimals),
    });
  }

  const balance = await connection.getBalance({ owner: args.address });
  return successResponse({
    balance: parseFloat(balance.totalBalance) / Number(MIST_PER_SUI),
  });
};

const transfer = async (args: TransferPayload): Promise<IResponse> => {
  try {
    const connection = provider(args.rpcUrl);

    const senderKeypair = Ed25519Keypair.fromSecretKey(args.privateKey);

    const txb = new Transaction();

    if (args.tokenAddress) {
      // Fetch token decimals
      const metadata = await connection.getCoinMetadata({
        coinType: args.tokenAddress,
      });
      const decimals = metadata?.decimals || 0;
      const rawAmount = BigInt(
        Math.floor(args.amount * Math.pow(10, decimals))
      );

      // Fetch sender's coins for the token
      const { data: coins } = await connection.getCoins({
        owner: senderKeypair.getPublicKey().toSuiAddress(),
        coinType: args.tokenAddress,
      });

      if (!coins.length) throw new Error('No coins found.');

      // Split the coin for the amount to transfer
      const [coin] = txb.splitCoins(txb.object(coins[0].coinObjectId), [
        txb.pure.u64(rawAmount),
      ]);
      txb.transferObjects([coin], txb.pure.address(args.recipientAddress));
    } else {
      // native sui transfer
      const amountInMist = BigInt(
        Math.floor(args.amount * Number(MIST_PER_SUI))
      );
      const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(amountInMist)]);
      txb.transferObjects([coin], txb.pure.address(args.recipientAddress));
    }

    // Sign and execute the transaction
    const result = await connection.signAndExecuteTransaction({
      signer: senderKeypair,
      transaction: txb,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });

    return successResponse({
      ...result,
    });
  } catch (error) {
    throw error;
  }
};

const getTransaction = async (
  args: GetTransactionPayload
): Promise<IResponse> => {
  const connection = getConnection(args.rpcUrl);

  try {
    // Use getTransactionBlock for Sui
    const tx = await connection.getTransactionBlock({
      digest: args.hash,
      options: {
        showInput: true,
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
        showBalanceChanges: true,
      },
    });

    return successResponse({
      ...tx,
    });
  } catch (error) {
    throw error;
  }
};

const getTokenInfo = async (args: IGetTokenInfoPayload): Promise<IResponse> => {
  try {
    const connection = getConnection(args.rpcUrl);

    const metadata = await connection.getCoinMetadata({
      coinType: args.address,
    });
    if (!metadata) {
      throw new Error('Token metadata not found');
    }

    const supply = await connection.getTotalSupply({ coinType: args.address });

    const data: ITokenInfo = {
      name: metadata.name,
      symbol: metadata.symbol,
      address: args.address,
      decimals: metadata.decimals,
      logoUrl: metadata.iconUrl ?? undefined,
      totalSupply: supply.value.toString(),
    };

    return successResponse({ ...data });
  } catch (error) {
    throw error;
  }
};

const smartContractCall = async (
  args: ISmartContractCallPayload
): Promise<IResponse> => {
  const connection = getConnection(args.rpcUrl);
  const txb = new Transaction();

  // Validate params and paramTypes length match
  if (args.params.length !== (args.paramTypes ?? []).length) {
    throw new Error('Number of params and paramTypes must match');
  }

  // handle objects and serialize parameters as the arguments expected by the MoveVM are in binary format (BCS) when sending transactions.
  const moveCallArgs = args.params.map((param, idx) => {
    const type = (args.paramTypes ?? [])[idx];

    // Handle vector and option types
    if (type.startsWith('vector<') && type.endsWith('>')) {
      const innerType = type.slice(7, -1); // e.g., 'u8' from 'vector<u8>'
      return txb.pure.vector(innerType as PureTypeName, param);
    }
    if (type.startsWith('option<') && type.endsWith('>')) {
      const innerType = type.slice(7, -1); // e.g., 'u64' from 'option<u64>'
      return txb.pure.option(innerType as PureTypeName, param);
    }

    // Handle primitive types and objects(stored onchain with objectId)
    switch (type) {
      case 'address':
        return txb.pure.address(param);
      case 'string':
        return txb.pure.string(param);
      case 'u8':
        return txb.pure.u8(param);
      case 'u16':
        return txb.pure.u16(param);
      case 'u32':
        return txb.pure.u32(param);
      case 'u64':
        return txb.pure.u64(param);
      case 'u128':
        return txb.pure.u128(param);
      case 'u256':
        return txb.pure.u256(param);
      case 'bool':
        return txb.pure.bool(param);
      case 'object':
        return txb.object(param);
      default:
        throw new Error(`Unsupported parameter type: ${type}`);
    }
  });

  // Build moveCall
  txb.moveCall({
    target: args.contractAddress, //it should be in the form (0xAddress::module_name::function_name)
    arguments: moveCallArgs,
    typeArguments: args.typeArguments ?? [],
  });

  // Set gas budget
  txb.setGasBudget(args.gasLimit ?? 0);


  if (args.methodType === 'read') {
    const sender = args.sender || '0x0';
    const result = await connection.devInspectTransactionBlock({
      sender,
      transactionBlock: txb,
    });

    if (result.effects.status.status !== 'success') {
      throw new Error(result.effects.status.error || 'View call failed');
    }

    return successResponse({ data: result });
  }

  if (args.methodType === 'write') {
    if (!args.privateKey) throw new Error('Private key required');
    const keypair = Ed25519Keypair.fromSecretKey(args.privateKey);

    try {
      const result = await connection.signAndExecuteTransaction({
        signer: keypair,
        transaction: txb,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      if (!result.effects || result.effects.status.status !== 'success') {
        throw new Error(result.effects?.status.error || 'Transaction failed');
      }

      return successResponse({ digest: result.digest, data: result });
    } catch (error) {
      throw error;
    }
  }

  throw new Error('Invalid methodType. Expected "read" or "write".');
};

export default {
  createWallet,
  generateWalletFromMnemonic,
  getAddressFromPrivateKey,
  getBalance,
  transfer,
  getTransaction,
  getTokenInfo,
  smartContractCall,
};
