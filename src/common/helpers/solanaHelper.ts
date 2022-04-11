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
