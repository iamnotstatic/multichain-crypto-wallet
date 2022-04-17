import provider from '../utils/solana';
import * as solanaWeb3 from '@solana/web3.js';
import {
  BalancePayload,
  GetAddressFromPrivateKeyPayload,
  TransferPayload,
} from '../utils/types';
import * as bs58 from 'bs58';
import { successResponse } from '../utils';
import * as bip39 from 'bip39';

const getConnection = (rpcUrl: string) => {
  const connection = provider(rpcUrl);

  return connection;
};

const getBalance = async (args: BalancePayload) => {
  const connection = getConnection(args.rpcUrl);

  try {
    const publicKey = new solanaWeb3.PublicKey(args.address);
    const balance = await connection.getBalance(publicKey);

    return successResponse({
      balance,
    });
  } catch (error) {
    throw error;
  }
};

const createWallet = async () => {
  const mnemonic = bip39.generateMnemonic();
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const keyPair = solanaWeb3.Keypair.fromSeed(seed.slice(0, 32));

  return successResponse({
    address: keyPair.publicKey.toBase58(),
    privateKey: bs58.encode(keyPair.secretKey),
    mnemonic,
  });
};

const generateWalletFromMnemonic = async (mnemonic: string) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  let keyPair = solanaWeb3.Keypair.fromSeed(seed.slice(0, 32));

  return successResponse({
    address: keyPair.publicKey.toBase58(),
    privateKey: bs58.encode(keyPair.secretKey),
    mnemonic,
  });
};

const transfer = async (args: TransferPayload) => {
  const connection = getConnection(args.rpcUrl);

  try {
    const receiver = new solanaWeb3.PublicKey(args.recipientAddress);
    let secretKey;

    if (args.privateKey.split(',').length > 1) {
      secretKey = new Uint8Array(args.privateKey.split(',') as any);
    } else {
      secretKey = bs58.decode(args.privateKey);
    }

    const from = solanaWeb3.Keypair.fromSecretKey(secretKey, {
      skipValidation: true,
    });

    const transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: receiver,
        lamports: solanaWeb3.LAMPORTS_PER_SOL * args.amount,
      })
    );

    // Sign transaction, broadcast, and confirm
    const signature = await solanaWeb3.sendAndConfirmTransaction(
      connection,
      transaction,
      [from]
    );

    return successResponse({
      hash: signature,
    });
  } catch (error) {
    throw error;
  }
};

const getAddressFromPrivateKey = async (
  args: GetAddressFromPrivateKeyPayload
) => {
  let secretKey;

  if (args.privateKey.split(',').length > 1) {
    secretKey = new Uint8Array(args.privateKey.split(',') as any);
  } else {
    secretKey = bs58.decode(args.privateKey);
  }

  const keyPair = solanaWeb3.Keypair.fromSecretKey(secretKey, {
    skipValidation: true,
  });

  return successResponse({
    address: keyPair.publicKey.toBase58(),
  });
};

export default {
  getBalance,
  createWallet,
  generateWalletFromMnemonic,
  transfer,
  getAddressFromPrivateKey,
};
