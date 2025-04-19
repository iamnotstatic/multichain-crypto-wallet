import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import { BIP32Factory } from 'bip32';
import { ECPairFactory } from 'ecpair';
import * as bip39 from 'bip39';
import { successResponse } from '../utils';
import BigNumber from 'bignumber.js';
import { List } from 'immutable';
import * as utxolib from '@bitgo/utxo-lib';

import { _apiFallbacks } from '../fallbacks/btc';
import { fallback, retryNTimes } from '../utils/retry';
import {
  BalancePayload,
  CreateWalletPayload,
  GenerateWalletFromMnemonicPayload,
  GetAddressFromPrivateKeyPayload,
  GetTransactionPayload,
  IResponse,
  Network,
  TransferPayload,
} from '../utils/types';
import { BitgoUTXOLib } from '../libs/bitgoUtxoLib';

const bip32 = BIP32Factory(ecc);
const ECPair = ECPairFactory(ecc);

const createWallet = ({
  network,
  derivationPath,
}: CreateWalletPayload): IResponse => {
  if (derivationPath) {
    const purpose = derivationPath?.split('/')[1];
    if (purpose !== "44'") {
      throw new Error('Invalid derivation path');
    }
  }

  const path = derivationPath || "m/44'/0'/0'/0/0";
  const mnemonic = bip39.generateMnemonic();
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  const node = bip32.fromSeed(seed);
  const child = node.derivePath(path);
  const actualNetwork = getNetwork(network);

  const { address } = bitcoin.payments.p2pkh({
    pubkey: child.publicKey,
    network: actualNetwork,
  });

  const privateKey = child.toWIF();

  return successResponse({
    address,
    privateKey,
    mnemonic,
  });
};

const generateWalletFromMnemonic = ({
  network,
  mnemonic,
  derivationPath,
}: GenerateWalletFromMnemonicPayload): IResponse => {
  if (derivationPath) {
    const purpose = derivationPath?.split('/')[1];
    if (purpose !== "44'") {
      throw new Error('Invalid derivation path ');
    }
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const path = derivationPath || "m/44'/0'/0'/0/0";

  const node = bip32.fromSeed(seed);
  const child = node.derivePath(path);
  const actualNetwork = getNetwork(network);

  const { address } = bitcoin.payments.p2pkh({
    pubkey: child.publicKey,
    network: actualNetwork,
  });

  const privateKey = child.toWIF();

  return successResponse({
    address,
    privateKey,
    mnemonic,
  });
};

const getAddressFromPrivateKey = ({
  privateKey,
  network,
}: GetAddressFromPrivateKeyPayload): IResponse => {
  const actualNetwork = getNetwork(network);

  const keyPair = ECPair.fromWIF(privateKey);

  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: actualNetwork,
  });

  return successResponse({
    address,
  });
};

const getBalance = async ({
  address,
  network,
}: BalancePayload): Promise<IResponse> => {
  const testnet = isTestnet(network);

  const endpoints = _apiFallbacks.fetchUTXOs(testnet, address, 0);
  const utxos = await fallback(endpoints);

  const bn = utxos
    .reduce((sum, utxo) => sum.plus(utxo.amount), new BigNumber(0))
    .dividedBy(new BigNumber(10).exponentiatedBy(8));

  return successResponse({
    balance: bn.toNumber(),
  });
};

const transfer = async (args: TransferPayload): Promise<IResponse> => {
  const testnet = isTestnet(args.network);

  const keyPair = ECPair.fromWIF(args.privateKey);

  const privateKey = utxolib.ECPair.fromPrivateKeyBuffer(
    keyPair.privateKey,
    args.network === 'bitcoin'
      ? utxolib.networks.bitcoin
      : utxolib.networks.testnet
  );

  const fromAddress = getAddressFromPrivateKey({
    privateKey: args.privateKey,
    network: args.network,
  }).address;

  const changeAddress = fromAddress;
  const endpoints = _apiFallbacks.fetchUTXOs(testnet, fromAddress, 0);

  const utxos = List(await fallback(endpoints))
    .sortBy(utxo => utxo.amount)
    .reverse()
    .toArray();

  const amount = new BigNumber(args.amount.toString());

  const built = await BitgoUTXOLib.buildUTXO(
    testnet ? utxolib.networks.testnet : utxolib.networks.bitcoin,
    privateKey,
    changeAddress,
    args.recipientAddress,
    amount.times(new BigNumber(10).exponentiatedBy(8)),
    utxos,
    {
      fee: args.fee,
      subtractFee: args.subtractFee,
    }
  );

  const txHash = await retryNTimes(
    () => fallback(_apiFallbacks.broadcastTransaction(testnet, built.toHex())),
    3
  );

  try {
    const transaction = await fallback(
      _apiFallbacks.fetchUTXO(testnet, txHash, 0)
    );

    const bigAmount = new BigNumber(transaction.amount);

    // Convert amount from Satoshi to Bitcoin
    const amountToBtc = bigAmount.dividedBy(
      new BigNumber(10).exponentiatedBy(8)
    );

    return successResponse({
      ...transaction,
      amount: amountToBtc.toNumber(),
    });
  } catch (e) {
    return successResponse({
      txHash,
    });
  }
};

const getTransaction = async ({
  hash,
  network,
}: GetTransactionPayload): Promise<IResponse> => {
  const testnet = isTestnet(network);

  const transaction = await fallback(_apiFallbacks.fetchUTXO(testnet, hash, 0));
  const bigAmount = new BigNumber(transaction.amount);

  const amount = bigAmount.dividedBy(new BigNumber(10).exponentiatedBy(8));

  return successResponse({
    ...transaction,
    amount: amount.toNumber(),
  });
};

function getNetwork(network: Network) {
  return network === 'bitcoin'
    ? bitcoin.networks.bitcoin
    : network === 'bitcoin-testnet'
    ? bitcoin.networks.testnet
    : bitcoin.networks.bitcoin;
}

function isTestnet(network: Network) {
  return network === 'bitcoin-testnet';
}

export default {
  createWallet,
  generateWalletFromMnemonic,
  getAddressFromPrivateKey,
  getBalance,
  transfer,
  getTransaction,
};
