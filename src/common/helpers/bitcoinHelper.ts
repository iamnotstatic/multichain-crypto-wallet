import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import { BIP32Factory } from 'bip32';
import { ECPairFactory } from 'ecpair';
import * as bip39 from 'bip39';
import { successResponse } from '../utils';

const bip32 = BIP32Factory(ecc);
const ECPair = ECPairFactory(ecc);

const createWallet = async (network: string, derivationPath?: string) => {
  const path = derivationPath || "m/44'/0'/0'/0/0";
  const mnemonic = bip39.generateMnemonic();
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  const node = bip32.fromSeed(seed);
  const child = node.derivePath(path);
  const actualNetwork =
    network === 'bitcoin'
      ? bitcoin.networks.bitcoin
      : network === 'bitcoin-testnet'
      ? bitcoin.networks.testnet
      : bitcoin.networks.bitcoin;

  const { address } = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network: actualNetwork,
    }),
    network: actualNetwork,
  });

  const privateKey = child.toWIF();

  return successResponse({
    address,
    privateKey,
    mnemonic,
  });
};

const generateWalletFromMnemonic = async (
  network: string,
  mnemonic: string,
  derivationPath?: string
) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const path = derivationPath || "m/44'/0'/0'/0/0";

  const node = bip32.fromSeed(seed);
  const child = node.derivePath(path);
  const actualNetwork =
    network === 'bitcoin'
      ? bitcoin.networks.bitcoin
      : network === 'bitcoin-testnet'
      ? bitcoin.networks.testnet
      : bitcoin.networks.bitcoin;

  const { address } = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network: actualNetwork,
    }),
    network: actualNetwork,
  });

  const privateKey = child.toWIF();

  return successResponse({
    address,
    privateKey,
    mnemonic,
  });
};

const getAddressFromPrivateKey = async (privateKey: string) => {
  const keyPair = ECPair.fromWIF(privateKey);
  const { address } = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey }),
  });

  return successResponse({
    address,
  });
};

export default {
  createWallet,
  generateWalletFromMnemonic,
  getAddressFromPrivateKey,
};
