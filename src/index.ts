import Wallet from './services/wallet';

class MultichainCryptoWallet {
  Wallet: Wallet;

  constructor() {
    this.Wallet = new Wallet();
  }
}

export default MultichainCryptoWallet;
