import BigNumber from 'bignumber.js';
import * as bitcoin from '@bitgo/utxo-lib';

import { UTXO } from '../utils/utxo';

const buildUTXO = async (
  network: typeof bitcoin.networks.bitcoin,
  privateKey: any,
  changeAddress: string,
  toAddress: string,
  valueIn: BigNumber,
  utxos: UTXO[],
  options?: {
    subtractFee?: boolean;
    fee?: number;
    signFlag?: number;
    version?: number;
    versionGroupID?: number;
    expiryHeight?: number;
    lockTime?: number;
    consensusBranchId?: number;
  }
): Promise<{ toHex: () => string }> => {
  const fees = new BigNumber(
    options && options.fee !== undefined ? options.fee : 10000
  );

  const value = options && options.subtractFee ? valueIn.minus(fees) : valueIn;
  if (value.lt(0)) {
    throw new Error(
      `Unable to include fee in value, fee exceeds value (${fees.toFixed()} > ${valueIn.toFixed()})`
    );
  }

  const tx = new bitcoin.TransactionBuilder(network);
  if (options && options.version) {
    tx.setVersion(options.version);
  }
  if (options && options.versionGroupID) {
    tx.setVersionGroupId(options.versionGroupID);
  }
  if (options && options.expiryHeight) {
    tx.setExpiryHeight(options.expiryHeight);
  }
  if (options && options.lockTime) {
    tx.setLockTime(options.lockTime);
  }
  if (options && options.consensusBranchId) {
    tx.setConsensusBranchId(options.consensusBranchId);
  }

  // Only use the required utxos
  const [usedUTXOs, sum] = utxos.reduce(
    ([utxoAcc, total], utxo) =>
      total.lt(value.plus(fees))
        ? [[...utxoAcc, utxo], total.plus(utxo.amount)]
        : [utxoAcc, total],
    [[] as UTXO[], new BigNumber(0)]
  );

  if (sum.lt(value.plus(fees))) {
    throw new Error('Insufficient balance to broadcast transaction');
  }

  // Add all inputs
  usedUTXOs.map(utxo => tx.addInput(utxo.txHash, utxo.vOut));

  const change = sum.minus(value).minus(fees);

  // Add outputs
  tx.addOutput(toAddress, value.toNumber());
  if (change.gt(0)) {
    tx.addOutput(changeAddress, change.toNumber());
  }

  // Sign inputs
  usedUTXOs.map((utxo, i) =>
    tx.sign(
      i,
      privateKey,
      null,
      options && options.signFlag !== undefined ? options.signFlag : null,
      utxo.amount
    )
  );

  return tx.build();
};

export const BitgoUTXOLib = {
  buildUTXO,
};
