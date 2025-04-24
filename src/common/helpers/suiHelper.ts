import provider from '../utils/sui';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { MIST_PER_SUI } from '@mysten/sui/utils';
import {
  BalancePayload,
  CreateWalletPayload,
  GenerateWalletFromMnemonicPayload,
  GetAddressFromPrivateKeyPayload,
  GetTransactionPayload,
  IGetTokenInfoPayload,
  ISmartContractCallPayload,
  ITokenInfo,
  IResponse,
  TransferPayload,
} from '../utils/types';
import * as bip39 from 'bip39';
import { successResponse } from '../utils';

const getConnection = (rpcUrl?: string) => {
  const connection = provider(rpcUrl);

  return connection;
};

const createWallet = ({ derivationPath }: CreateWalletPayload): IResponse => {
  // default ed25519 derivation path for sui
  const path = derivationPath || "m/44'/784'/0'/0'/0'";

  const mnemonic = bip39.generateMnemonic();

  const keypair = Ed25519Keypair.deriveKeypair(mnemonic, path);

  const publicKey = keypair.getPublicKey();
  const address = publicKey.toSuiAddress();

  // get the private/secret key(Bech32-encoded, sui standard)
  const secretKey = keypair.getSecretKey();

  return successResponse({
    address: address,
    privateKey: secretKey,
    mnemonic: mnemonic,
  });
};

const generateWalletFromMnemonic = ({
  mnemonic,
  derivationPath,
}: GenerateWalletFromMnemonicPayload): IResponse => {
  const path = derivationPath || "m/44'/784'/0'/0'/0'";

  const keyPair = Ed25519Keypair.deriveKeypair(mnemonic, path);

  const publicKey = keyPair.getPublicKey();
  const address = publicKey.toSuiAddress();

  const secretKey = keyPair.getSecretKey();

  return successResponse({
    address: address,
    privateKey: secretKey,
    mnemonic: mnemonic,
  });
};

const getAddressFromPrivateKey = ({
  privateKey,
}: GetAddressFromPrivateKeyPayload): IResponse => {
  const keypair = Ed25519Keypair.fromSecretKey(privateKey, {
    skipValidation: false,
  });

  const publicKey = keypair.getPublicKey();
  const address = publicKey.toSuiAddress();

  return successResponse({
    address: address,
  });
};

const getBalance = async (args: BalancePayload): Promise<IResponse> => {
  const connection = getConnection(args.rpcUrl);

  if (args.tokenAddress) {
    const balance = await connection.getBalance({
      owner: args.address,
      coinType: args.tokenAddress,
    });
    return successResponse({
      balance: parseFloat(balance.totalBalance) / Number(MIST_PER_SUI),
    });
  }

  const balance = await connection.getBalance({ owner: args.address });
  return successResponse({
    balance: parseFloat(balance.totalBalance) / Number(MIST_PER_SUI),
  });
};

export default {
  createWallet,
  generateWalletFromMnemonic,
  getAddressFromPrivateKey,
  getBalance,
};
