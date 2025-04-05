import provider from '../utils/solana';
import * as solanaWeb3 from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';
import {
  getOrCreateAssociatedTokenAccount,
  transfer as transferToken,
  getMint,
} from '@solana/spl-token';
import {
  BalancePayload,
  GetTransactionPayload,
  IGetTokenInfoPayload,
  ISplTokenInfo,
  ITokenInfo,
  TransferPayload,
} from '../utils/types';
import * as bs58 from 'bs58';
import { successResponse } from '../utils';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
// @ts-ignore
import * as BufferLayout from 'buffer-layout';
import axios from 'axios';
import nacl from 'tweetnacl';

export const ACCOUNT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(32, 'mint'),
  BufferLayout.blob(32, 'owner'),
  BufferLayout.nu64('amount'),
  BufferLayout.blob(93),
]);
export const chainId = {
  'mainnet-beta': 101,
  testnet: 102,
  devnet: 103,
};

const getConnection = (rpcUrl?: string) => {
  const connection = provider(rpcUrl);

  return connection;
};

const createWallet = (derivationPath?: string) => {
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

const generateWalletFromMnemonic = (
  mnemonic: string,
  derivationPath?: string
) => {
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

const getAddressFromPrivateKey = (privateKey: string) => {
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

const getBalance = async (args: BalancePayload) => {
  const connection = getConnection(args.rpcUrl);

  try {
    let balance;
    if (args.tokenAddress) {
      const account = await connection.getTokenAccountsByOwner(
        new solanaWeb3.PublicKey(args.address),
        {
          mint: new solanaWeb3.PublicKey(args.tokenAddress),
        }
      );

      balance =
        account.value.length > 0
          ? ACCOUNT_LAYOUT.decode(account.value[0].account.data).amount
          : 0;

      return successResponse({
        balance: balance / solanaWeb3.LAMPORTS_PER_SOL,
      });
    }

    const publicKey = new solanaWeb3.PublicKey(args.address);
    balance = await connection.getBalance(publicKey);

    return successResponse({
      balance: balance / solanaWeb3.LAMPORTS_PER_SOL,
    });
  } catch (error) {
    throw error;
  }
};

const transfer = async (args: TransferPayload) => {
  const connection = getConnection(args.rpcUrl);

  try {
    const recipient = new solanaWeb3.PublicKey(args.recipientAddress);
    let secretKey;
    let signature;

    if (args.privateKey.split(',').length > 1) {
      secretKey = new Uint8Array(args.privateKey.split(',') as any);
    } else {
      secretKey = bs58.decode(args.privateKey);
    }

    const from = solanaWeb3.Keypair.fromSecretKey(secretKey, {
      skipValidation: true,
    });

    if (args.tokenAddress) {
      // Get token mint
      const mint = await getMint(
        connection,
        new solanaWeb3.PublicKey(args.tokenAddress)
      );

      // Get the token account of the from address, and if it does not exist, create it
      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        from,
        mint.address,
        from.publicKey
      );

      // Get the token account of the recipient address, and if it does not exist, create it
      const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        from,
        mint.address,
        recipient
      );

      signature = await transferToken(
        connection,
        from,
        fromTokenAccount.address,
        recipientTokenAccount.address,
        from.publicKey,
        solanaWeb3.LAMPORTS_PER_SOL * args.amount
      );
    } else {
      const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: recipient,
          lamports: solanaWeb3.LAMPORTS_PER_SOL * args.amount,
        })
      );

      signature = await solanaWeb3.sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
      );
    }

    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    return successResponse({
      ...tx,
    });
  } catch (error) {
    throw error;
  }
};

const getTransaction = async (args: GetTransactionPayload) => {
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

const getTokenInfo = async (args: IGetTokenInfoPayload) => {
  try {
    const connection = getConnection(args.rpcUrl);
    const tokenList = await getTokenList(args.cluster!);
    const token = tokenList.find(token => token.address === args.address);

    if (token) {
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
    }

    return;
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

export function signSolanaMessage(message: string, privateKey: Uint8Array): Uint8Array {
  // Validate input message
  if (!message || typeof message !== 'string') {
    throw new Error('Message must be a non-empty string');
  }

  // Validate private key
  if (!(privateKey instanceof Uint8Array) || privateKey.length !== 64) {
    throw new Error('Private key must be a 64-byte Uint8Array');
  }

  try {
    // Create keypair from private key
    const keypair = Keypair.fromSecretKey(privateKey);

    // Convert message to Uint8Array and sign
    const messageBytes = new TextEncoder().encode(message);
    //const signature = keypair.sign(messageBytes);
    const signature = nacl.sign.detached(messageBytes, keypair.secretKey.slice(0,32));

    // Verify signature lenght (Ed25519 signatures are 64 bytes)
    if (signature.length !== 64) {
      throw new Error('Invalid signature lenght');
    }

    return signature;
  } catch (error) {
    throw new Error(`Signing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export default {
  getBalance,
  createWallet,
  generateWalletFromMnemonic,
  transfer,
  getAddressFromPrivateKey,
  getTransaction,
  getTokenInfo,
};
