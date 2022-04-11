import provider from '../utils/solana';
import * as solanaWeb3 from '@solana/web3.js';

export const getConnection = (rpcUrl: string) => {
  const connection = provider(rpcUrl);

  return connection;
};

export const getSolBalance = async (rpcUrl: string, address: string) => {
  const connection = getConnection(rpcUrl);

  try {
    const publicKey = new solanaWeb3.PublicKey(address);
    const balance = await connection.getBalance(publicKey);

    return balance;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const createSolanaWallet = async () => {
  const keyPair = solanaWeb3.Keypair.generate();

  return {
    address: keyPair.publicKey.toBase58(),
    privateKey: keyPair.secretKey.toString(),
  };
};

export const transferSol = async (
  rpcUrl: string,
  key: any,
  to: string,
  amount: number
) => {
  const connection = getConnection(rpcUrl);

  try {
    const receiver = new solanaWeb3.PublicKey(to);

    const privateKey = new Uint8Array(key.split(','));
    const from = solanaWeb3.Keypair.fromSecretKey(privateKey);

    // Add transfer instruction to transaction
    const transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: receiver,
        lamports: solanaWeb3.LAMPORTS_PER_SOL * amount,
      })
    );

    // Sign transaction, broadcast, and confirm
    const signature = await solanaWeb3.sendAndConfirmTransaction(
      connection,
      transaction,
      [from]
    );

    return { hash: signature };
  } catch (error) {
    console.log(error);
    return error;
  }
};
