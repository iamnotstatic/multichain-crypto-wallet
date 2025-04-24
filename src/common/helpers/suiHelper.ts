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

export default {
  createWallet,
  generateWalletFromMnemonic,
  getAddressFromPrivateKey,
  getBalance,
  transfer,
  getTransaction,
};
