import provider from '../utils/solana';

export const getConnection = (rpcUrl: string) => {
  const { solanaWeb3, connection } = provider(rpcUrl);

  return {
    solanaWeb3,
    connection,
  };
};

export const getSolBalance = async (rpcUrl: string, address: string) => {
  const { connection, solanaWeb3 } = getConnection(rpcUrl);

  try {
    const publicKey = new solanaWeb3.PublicKey(address);
    const balance = await connection.getBalance(publicKey);

    return balance;
  } catch (error) {
    console.log(error);
    return error;
  }
};
