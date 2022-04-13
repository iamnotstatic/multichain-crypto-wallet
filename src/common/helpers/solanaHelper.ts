import provider from '../utils/solana';
import * as solanaWeb3 from '@solana/web3.js';
import { BalancePayload, TransferPayload } from '../utils/types';
import * as bs58 from 'bs58';
import { successResponse } from '../utils';

export const getConnection = (rpcUrl?: string) => {
  const connection = provider(rpcUrl);

  return connection;
};

export const getSolBalance = async (args: BalancePayload) => {
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

export const createSolanaWallet = async () => {
  const keyPair = solanaWeb3.Keypair.generate();

  return successResponse({
    address: keyPair.publicKey.toBase58(),
    privateKey: bs58.encode(keyPair.secretKey)
  });
 
};

export const transferSol = async (args: TransferPayload) => {
  const connection = getConnection(args.rpcUrl);

  try {
    const receiver = new solanaWeb3.PublicKey(args.toAddress);
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
