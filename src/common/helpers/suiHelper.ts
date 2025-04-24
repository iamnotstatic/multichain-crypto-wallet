import provider from '../utils/sui';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import {
  BalancePayload,
  CreateWalletPayload,
  GenerateWalletFromMnemonicPayload,
  GetAddressFromPrivateKeyPayload,
  GetTransactionPayload,
  GetWalletFromEncryptedjsonPayload,
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

  // get the secret key(Bech32-encoded, sui standard)
  const secretKey = keypair.getSecretKey();

  return successResponse({
    address,
    privateKey: secretKey,
    mnemonic,
  });
};

export default {
  createWallet
}