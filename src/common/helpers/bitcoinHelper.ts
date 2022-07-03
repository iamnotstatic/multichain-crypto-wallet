import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import { BIP32Factory } from 'bip32';
import { ECPairFactory } from 'ecpair';
import * as bip39 from 'bip39';
import { successResponse } from '../utils';

const bip32 = BIP32Factory(ecc);
const ECPair = ECPairFactory(ecc);

const createWallet = async (network: string, derivationPath?: string) => {
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
  const actualNetwork =
    network === 'bitcoin'
      ? bitcoin.networks.bitcoin
      : network === 'bitcoin-testnet'
      ? bitcoin.networks.testnet
      : bitcoin.networks.bitcoin;

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

const generateWalletFromMnemonic = async (
  network: string,
  mnemonic: string,
  derivationPath?: string
) => {
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
  const actualNetwork =
    network === 'bitcoin'
      ? bitcoin.networks.bitcoin
      : network === 'bitcoin-testnet'
      ? bitcoin.networks.testnet
      : bitcoin.networks.bitcoin;

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

const getAddressFromPrivateKey = async (
  privateKey: string,
  network: string
) => {
  const actualNetwork =
    network === 'bitcoin'
      ? bitcoin.networks.bitcoin
      : network === 'bitcoin-testnet'
      ? bitcoin.networks.testnet
      : bitcoin.networks.bitcoin;
      
  const keyPair = ECPair.fromWIF(privateKey);

  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: actualNetwork,
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
