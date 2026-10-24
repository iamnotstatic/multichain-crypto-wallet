import provider from '../utils/ton';
import {
  WalletContractV4,
  WalletContractV5R1,
  JettonMaster,
  JettonWallet,
  TonClient,
  OpenedContract,
  SendMode
} from '@ton/ton';
import {
  mnemonicNew,
  keyPairFromSeed,
  keyPairFromSecretKey,
  mnemonicToHDSeed,
  mnemonicToPrivateKey,
  deriveEd25519Path,
} from '@ton/crypto';
import {
  Address,
  fromNano,
  toNano,
  internal,
  beginCell,
  Cell,
} from "@ton/core";

import { derivePath } from 'ed25519-hd-key';
import { mnemonicToSeed } from 'bip39';

import {
  CreateWalletPayload,
  GenerateWalletFromMnemonicPayload,
  GetAddressFromPrivateKeyPayload,
  GetTransactionPayload,
  BalancePayload,
  TransferPayload,
  TonWalletVersion,
  IGetTokenInfoPayload,
  ITokenInfo,
  IResponse,
} from '../utils/types';

import { successResponse } from '../utils';

interface GetContract {
  rpcUrl?: string;
  privateKey: string;
  walletVersion?: TonWalletVersion;
  apiKey?: string;
}

const WALLET_VERSIONS: Record<TonWalletVersion, any> = {
  v4R2: WalletContractV4,
  W5: WalletContractV5R1
};

/**
 * Waits for a transaction hash after sending a transfer.
 * @param contract - Opened wallet contract.
 * @param address - Wallet address to check.
 * @param connection - TON client connection.
 * @param prevSeqno - Previous seqno value.
 * @param retries - Number of retries before giving up.
 * @param delay - Delay between retries (ms).
 * @returns Transaction hash in hex format, or null if not found.
 */
async function waitTxHash(
  contract: OpenedContract<any>,
  address: Address,
  connection: TonClient,
  prevSeqno: number,
  retries = 15,
  delay = 2000
): Promise<string | null> {
  for (let i = 0; i < retries; i++) {
    const newSeqno = await contract.getSeqno().catch(() => prevSeqno);
    if (newSeqno > prevSeqno) {
      const txs = await connection.getTransactions(address, { limit: 1 });
      if (txs.length > 0) {
        return txs[0].hash().toString("hex");
      }
    }
    await new Promise(res => setTimeout(res, delay));
  }
  return null;
}

/**
 * Parses a raw TON transaction object into a simplified structure.
 * @param tx - Raw transaction.
 * @returns Parsed transaction object or null.
 */
function parseTransaction(tx: any) {
  if (!tx) return null;

  const inMsg = tx.inMessage?.info;
  const outMsgs: any[] = [];

  if (tx.outMessages) {
    for (const [, msg] of tx.outMessages) {
      outMsgs.push({
        from: msg.info?.src?.toString(),
        to: msg.info?.dest?.toString(),
        value: msg.info?.value?.coins?.toString(),
        body: msg.body?.toString(),
      });
    }
  }

  return {
    hash: tx.hash ? tx.hash().toString("hex") : undefined,
    lt: tx.lt?.toString(),
    utime: tx.now,
    from: inMsg?.src?.toString() || tx.address.toString(),
    to: inMsg?.dest?.toString() || null,
    value: inMsg?.value?.coins?.toString() || "0",
    fee: tx.totalFees?.coins?.toString() || "0",
    success: !tx.description?.aborted,
    messages: outMsgs,
  };
}

const getConnection = (rpcUrl?: string, apiKey?: string) => provider(rpcUrl, apiKey);

/**
 * Initializes a wallet contract from a private key.
 * Deploys wallet if not already deployed.
 */
const getContract = async ({ privateKey, rpcUrl, apiKey, walletVersion = 'v4R2' }: GetContract) => {
  const connection = getConnection(rpcUrl, apiKey);

  const WalletClass = WALLET_VERSIONS[walletVersion];
  if (!WalletClass) throw new Error(`Unsupported wallet version: ${walletVersion}`);

  const keyPair = keyPairFromSecretKey(Buffer.from(privateKey, 'hex'));
  const wallet = WalletClass.create({ publicKey: keyPair.publicKey, workchain: 0 });
  const contract = connection.open(wallet);

  const seqno = await contract.getSeqno().catch(() => 0);
  const isDeployed = await connection.isContractDeployed(wallet.address);

  if (isDeployed) {
    return { keyPair, wallet, contract, seqno, connection };
  }

  let sendMode;
  if (walletVersion === "W5") {
    sendMode = SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS;
  }

  await contract.sendTransfer({
    seqno,
    secretKey: keyPair.secretKey,
    sendMode,
    messages: [
      internal({
        to: wallet.address,
        value: toNano("0.01"), // minimal 0.01 TON
        bounce: false,
        body: 'Activate wallet with @ton/ton',
      }),
    ],
  });

  return { keyPair, wallet, contract, seqno, connection };
};

/**
 * Creates a new wallet with a fresh mnemonic and keypair.
 */
const createWallet = async ({ cluster, walletVersion = 'v4R2' }: CreateWalletPayload): Promise<IResponse> => {
  const mnemonic = await mnemonicNew(24);
  const seed = await mnemonicToHDSeed(mnemonic);
  const derived = await deriveEd25519Path(seed, [44, 607, 0]);
  const keyPair = keyPairFromSeed(derived);

  const WalletClass = WALLET_VERSIONS[walletVersion];
  if (!WalletClass) throw new Error(`Unsupported wallet version: ${walletVersion}`);

  const wallet = WalletClass.create({ publicKey: keyPair.publicKey, workchain: 0 });
  const address = wallet.address.toString({
    testOnly: cluster !== 'mainnet',
    bounceable: false,
    urlSafe: true
  });

  return successResponse({
    address,
    privateKey: keyPair.secretKey.toString('hex'),
    mnemonic: mnemonic.join(' ')
  });
};

/**
 * Generates a wallet from a mnemonic (12 or 24 words).
 */
const generateWalletFromMnemonic = async ({ mnemonic, cluster, walletVersion = 'v4R2' }: GenerateWalletFromMnemonicPayload): Promise<IResponse> => {
  const WalletClass = WALLET_VERSIONS[walletVersion];
  if (!WalletClass) throw new Error(`Unsupported wallet version: ${walletVersion}`);

  const mnemonics = Array.isArray(mnemonic) ? mnemonic : mnemonic.trim().split(/\s+/);

  let keyPair, privateKeys;

  if (mnemonics.length === 12) {
    const seed = await mnemonicToSeed(mnemonics.join(' '));
    const derived = derivePath("m/44'/607'/0'", seed.toString('hex'));
    keyPair = keyPairFromSeed(derived.key);
    privateKeys = keyPair.secretKey.toString('hex');
  } else if (mnemonics.length === 24) {
    keyPair = await mnemonicToPrivateKey(mnemonics);
    privateKeys = keyPair.secretKey.toString('hex');
  } else {
    throw new Error('Mnemonic must be 12 or 24 words');
  }

  const wallet = WalletClass.create({ publicKey: keyPair.publicKey, workchain: 0 });
  const address = wallet.address.toString({
    testOnly: cluster !== 'mainnet',
    bounceable: false,
    urlSafe: true
  });

  return successResponse({
    address,
    privateKey: privateKeys,
    mnemonic: mnemonics.join(' ')
  });
};

/**
 * Derives a wallet address from a private key.
 */
const getAddressFromPrivateKey = ({ privateKey, walletVersion = 'v4R2' }: GetAddressFromPrivateKeyPayload): IResponse => {
  const WalletClass = WALLET_VERSIONS[walletVersion];
  if (!WalletClass) throw new Error(`Unsupported wallet version: ${walletVersion}`);

  const keyPair = keyPairFromSecretKey(Buffer.from(privateKey, 'hex'));
  const wallet = WalletClass.create({ publicKey: keyPair.publicKey, workchain: 0 });

  return successResponse({
    address: wallet.address.toString({ bounceable: false, urlSafe: true }),
  });
};

/**
 * Retrieves wallet balance (TON or Jetton).
 */
const getBalance = async (args: BalancePayload): Promise<IResponse> => {
  if (!args.privateKey) throw new Error("privateKey is required for getBalance");

  const walletVersion = args.walletVersion || 'v4R2';

  const { wallet, contract, connection } = await getContract({
    privateKey: args.privateKey,
    rpcUrl: args.rpcUrl,
    apiKey: args.apiKey,
    walletVersion
  });

  if (args.tokenAddress) {
    const master = connection.open(JettonMaster.create(Address.parse(args.tokenAddress)));
    const jettonWalletAddress = await master.getWalletAddress(wallet.address);
    const jettonWallet = connection.open(JettonWallet.create(jettonWalletAddress));
    const balance = await jettonWallet.getBalance();

    return successResponse({
      balance: fromNano(balance),
      tokenAddress: args.tokenAddress
    });
  }

  const balance = await contract.getBalance();
  return successResponse({ balance: fromNano(balance) });
};

/**
 * Sends a transfer of TON or Jetton tokens.
 */
const transfer = async (args: TransferPayload): Promise<IResponse> => {
  try {
    const walletVersion = args.walletVersion || "v4R2";

    const { keyPair, seqno, contract, connection, wallet } = await getContract({
      privateKey: args.privateKey,
      rpcUrl: args.rpcUrl,
      apiKey: args.apiKey,
      walletVersion,
    });

    const amount = toNano(args.amount);
    const messages: any[] = [];

    const memoPayload = beginCell()
      .storeUint(0, 32)
      .storeStringTail(args.memo ?? "")
      .endCell();

    if (args.tokenAddress) {
      const master = connection.open(JettonMaster.create(Address.parse(args.tokenAddress)));
      const jettonWalletAddress = await master.getWalletAddress(wallet.address);
      const jettonWallet = connection.open(JettonWallet.create(jettonWalletAddress));

      const gasFee = toNano(args.gasPrice ?? "0.1");
      const forwardGas = toNano(args.forwardGas ?? "0");

      const payload: Cell = beginCell()
        .storeUint(0xf8a7ea5, 32) // jetton_transfer opcode
        .storeUint(0, 64) // query id
        .storeCoins(amount)
        .storeAddress(Address.parse(args.recipientAddress))
        .storeAddress(wallet.address)
        .storeBit(false)
        .storeCoins(forwardGas)
        .storeBit(1)
        .storeRef(memoPayload)
        .endCell();

      messages.push(internal({
        to: jettonWallet.address,
        value: gasFee,
        body: payload,
        bounce: true,
      }));
    } else {
      const recipientAddr = Address.parse(args.recipientAddress);
      const isDeployed = await connection.isContractDeployed(recipientAddr);

      messages.push(internal({
        to: args.recipientAddress,
        value: amount,
        body: memoPayload,
        bounce: isDeployed, 
      }));
    }

    const finalCell = await contract.createTransfer({
      seqno,
      secretKey: keyPair.secretKey,
      messages,
    });

    await connection.sendExternalMessage(wallet, finalCell);
    const transactionHash = await waitTxHash(contract, wallet.address, connection, seqno);

    return successResponse({
      transactionHash,
      to: args.recipientAddress,
      amount: fromNano(amount),
      tokenAddress: args.tokenAddress ?? null,
      forwardGas: args.forwardGas ?? null,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves a transaction by address and logical time.
 */
const getTransaction = async (args: GetTransactionPayload): Promise<IResponse> => {
  const connection = getConnection(args.rpcUrl, args.apiKey);
  try {
    if (!args.address || !args.logicalTime) {
      throw new Error("address and logicalTime are required for getTransaction");
    }

    const hashBase64 = /^[0-9a-fA-F]+$/.test(args.hash)
      ? Buffer.from(args.hash, "hex").toString("base64")
      : args.hash;

    const tx = await connection.getTransaction(Address.parse(args.address), args.logicalTime, hashBase64);
    const parsed = parseTransaction(tx);

    return successResponse({ trx: parsed });
  } catch (error) {
    throw error;
  }
};

/**
 * Recursively parses a TON Cell to extract all UTF-8 strings.
 */
function parseAllCellStrings(cell: Cell): string[] {
  const results: string[] = [];

  function traverse(c: Cell) {
    const slice = c.beginParse();
    const bytes: number[] = [];

    try {
      while (true) {
        bytes.push(Number(slice.loadUint(8)));
      }
    } catch { }

    if (bytes.length > 0) {
      if (bytes[0] === 0) bytes.shift();
      const str = Buffer.from(bytes).toString("utf8").trim();

      if (/^[\x20-\x7E]+$/.test(str) && str.length > 0) {
        results.push(str);
      }
    }

    for (const ref of c.refs) {
      traverse(ref);
    }
  }

  traverse(cell);
  return results;
}

/**
 * Retrieves token (Jetton) metadata information.
 */
const getTokenInfo = async (args: IGetTokenInfoPayload): Promise<IResponse> => {
  try {
    const connection = getConnection(args.rpcUrl, args.apiKey,);
    const master = connection.open(JettonMaster.create(Address.parse(args.address)));
    const onchainData = await master.getJettonData();

    if (!onchainData) {
      throw new Error("Token metadata not found");
    }

    const metaUrl = parseAllCellStrings(onchainData.content);
    const [logoUrl, name, symbol, decimalsStr] = metaUrl;

    const data: ITokenInfo = {
      name,
      symbol,
      address: args.address,
      decimals: decimalsStr ? Number(decimalsStr) : 9,
      logoUrl,
      totalSupply: onchainData.totalSupply.toString(),
    };

    return successResponse({ ...data });
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
  getTokenInfo,
};
