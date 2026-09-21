import provider from '../utils/solana';
import * as solanaWeb3 from '@solana/web3.js';
import {
  getOrCreateAssociatedTokenAccount,
  getAssociatedTokenAddress,
  getMint,
  createTransferInstruction,
} from '@solana/spl-token';
import {
  BalancePayload,
  CreateWalletPayload,
  GenerateWalletFromMnemonicPayload,
  GetAddressFromPrivateKeyPayload,
  GetTransactionPayload,
  IGetTokenInfoPayload,
  IResponse,
  ISplTokenInfo,
  ITokenInfo,
  TransferPayload,
} from '../utils/types';
import * as bs58 from 'bs58';
import { successResponse, parseAmount, formatAmount } from '../utils';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import axios from 'axios';

export const chainId = {
  'mainnet-beta': 101,
  testnet: 102,
  devnet: 103,
};

const getConnection = (rpcUrl?: string) => {
  const connection = provider(rpcUrl);
  return connection;
};

const createWallet = ({ derivationPath }: CreateWalletPayload) => {
  const path = derivationPath || "m/44'/501'/0'/0'";

  const mnemonic = bip39.generateMnemonic();
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const derivedSeed = derivePath(path, seed.toString('hex')).key;

  const keyPair = solanaWeb3.Keypair.fromSeed(
    (derivedSeed as unknown) as Uint8Array
  );

  return successResponse({
    address: keyPair.publicKey.toBase58(),
    privateKey: bs58.encode(keyPair.secretKey),
    mnemonic,
  });
};

const generateWalletFromMnemonic = ({
  mnemonic,
  derivationPath,
}: GenerateWalletFromMnemonicPayload): IResponse => {
  const path = derivationPath || "m/44'/501'/0'/0'";
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const derivedSeed = derivePath(path, seed.toString('hex')).key;

  const keyPair = solanaWeb3.Keypair.fromSeed(
    (derivedSeed as unknown) as Uint8Array
  );

  return successResponse({
    address: keyPair.publicKey.toBase58(),
    privateKey: bs58.encode(keyPair.secretKey),
    mnemonic,
  });
};

const getAddressFromPrivateKey = ({
  privateKey,
}: GetAddressFromPrivateKeyPayload): IResponse => {
  let secretKey;

  if (privateKey.split(',').length > 1) {
    secretKey = new Uint8Array(privateKey.split(',') as any);
  } else {
    secretKey = bs58.decode(privateKey);
  }

  const keyPair = solanaWeb3.Keypair.fromSecretKey(secretKey, {
    skipValidation: true,
  });

  return successResponse({
    address: keyPair.publicKey.toBase58(),
  });
};

const getBalance = async (args: BalancePayload): Promise<IResponse> => {
  const connection = getConnection(args.rpcUrl);

  try {
    let balance;
    const publicKey = new solanaWeb3.PublicKey(args.address);
    if (args.tokenAddress) {
      const mintPubkey = new solanaWeb3.PublicKey(args.tokenAddress);
      // get token by account
      const tokenAccountAddress = await getAssociatedTokenAddress(
        mintPubkey,
        publicKey
      );
      const accountInfo = await connection.getAccountInfo(tokenAccountAddress);

      // check if account not associated with this return 0 balance
      if (!accountInfo) {
        return successResponse({
          balance: '0',
        });
      }

      const rawBalance = await connection.getTokenAccountBalance(
        tokenAccountAddress
      );
      balance =
        rawBalance.value.uiAmountString ??
        formatAmount(rawBalance.value.amount, rawBalance.value.decimals);
    } else {
      const rawBalance = await connection.getBalance(publicKey);
      balance = formatAmount(rawBalance.toString(), 9);
    }

    return successResponse({ balance });
  } catch (error) {
    throw error;
  }
};

const transfer = async (args: TransferPayload): Promise<IResponse> => {
  const connection = getConnection(args.rpcUrl);

  try {
    const recipient = new solanaWeb3.PublicKey(args.recipientAddress);
    let secretKey: Uint8Array;
    let signature: string;

    if (args.privateKey.split(',').length > 1) {
      secretKey = new Uint8Array(args.privateKey.split(',') as any);
    } else {
      secretKey = bs58.decode(args.privateKey);
    }

    const from = solanaWeb3.Keypair.fromSecretKey(secretKey, {
      skipValidation: true,
    });

    const { blockhash } = await connection.getLatestBlockhash();

    if (args.tokenAddress) {
      // SPL Token Transfer
      const mint = await getMint(
        connection,
        new solanaWeb3.PublicKey(args.tokenAddress)
      );

      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        from,
        mint.address,
        from.publicKey
      );

      const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        from,
        mint.address,
        recipient
      );

      const amount = parseAmount(args.amount, mint.decimals);
      const tx = new solanaWeb3.Transaction().add(
        createTransferInstruction(
          fromTokenAccount.address,
          recipientTokenAccount.address,
          from.publicKey, // owner (signer)
          amount
        )
      );

      tx.recentBlockhash = blockhash;
      tx.feePayer = from.publicKey;

      signature = await solanaWeb3.sendAndConfirmTransaction(
        connection,
        tx,
        [from],
        {
          commitment: 'confirmed',
        }
      );
    } else {
      // Native SOL Transfer
      const amount = parseAmount(args.amount, 9); // SOL always 9 decimals
      const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: recipient,
          lamports: amount,
        })
      );

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = from.publicKey;

      signature = await solanaWeb3.sendAndConfirmTransaction(
        connection,
        transaction,
        [from],
        {
          commitment: 'confirmed',
        }
      );
    }

    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
      commitment: 'confirmed',
    });

    return successResponse({
      ...tx,
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
    const tx = await connection.getTransaction(args.hash, {
      maxSupportedTransactionVersion: 0,
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
    const tokenList = await getTokenList(args.cluster!);
    const token = tokenList.find(token => token.address === args.address);

    if (!token) {
      throw new Error('Token not found');
    }

    const data: ITokenInfo = {
      name: token.name,
      symbol: token.symbol,
      address: token.address,
      decimals: token.decimals,
      logoUrl: token.logoURI,
      totalSupply: '0',
    };

    const tokenSupply = await connection.getTokenSupply(
      new solanaWeb3.PublicKey(data.address)
    );
    data.totalSupply = tokenSupply.value.uiAmount!.toString();

    return successResponse({ ...data });
  } catch (error) {
    throw error;
  }
};

const getTokenList = async (
  cluster: 'mainnet-beta' | 'testnet' | 'devnet'
): Promise<ISplTokenInfo[]> => {
  const tokenListUrl =
    'https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json';
  const response = await axios.get(tokenListUrl);

  if (response.data && response.data.tokens) {
    return response.data.tokens.filter(
      (data: ISplTokenInfo) => data.chainId === chainId[cluster]
    );
  }

  return [];
};

export default {
  getBalance,
  createWallet,
  generateWalletFromMnemonic,
  transfer,
  getAddressFromPrivateKey,
  getTransaction,
  getTokenInfo,
};
