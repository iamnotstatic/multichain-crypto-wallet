import * as sui from '@mysten/sui';
import * as bip39 from 'bip39';

import {
  BalancePayload,
  CreateWalletPayload,
  TransferPayload,
} from '../utils/types';

const createWallet = ({ derivationPath }: CreateWalletPayload) => {
  const path = derivationPath || "m/44'/784'/0'/0'/0'";
  const mnemonic = bip39.generateMnemonic();
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  console.log(sui); // Example usage to avoid unused import error
};

export default {
  createWallet,
};