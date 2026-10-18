import axios from 'axios';

import { fixUTXO, fixUTXOs, sortUTXOs, UTXO } from '../utils/utxo';
import { DEFAULT_TIMEOUT } from './timeout';

export interface SoChainUTXO {
  hash: string; // hex string without 0x prefix
  index: number;
  script: string; // hex string without 0x prefix
  address: string;
  value: string; // "0.00010000"
  block: number | null; // null while unconfirmed
  tx_hex: string;
}

export interface SoChainAddressTX {
  hash: string; // hex string without 0x prefix
  value_sent: string; // "0.00000000"
  value_received: string; // "0.00980175"
  balance_change: string; // "0.00980175"
  time: number; // 1600217073
  block: number | null; // null while unconfirmed
}

export interface SoChainTX {
  hash: string; // "756548eb92505a7214b66faa8d1a77116e92d81d40b8d5a5c997dd83d1efb53b";
  confirmations: number; // 0;
  block_hash: string | null;
  block_height: number | null;
  time: number; // 1600217073;
  inputs: Array<{
    index: number; // 0;
    value: string; // "0.06498884";
    address: string | null; // "1JHKKk18HD6bgy4FKkJaVxCZpBx3hhRocf";
    scriptSig: { hex: string; asm: string };
    witness: string[];
    previous_output: {
      hash: string; // "229833c1bb68984721dba4ccfcfb092ec8ea000fd96de300baa49a2009ae5def";
      index: number; // 1;
    } | null;
    sequence: number;
  }>;
  outputs: Array<{
    index: number; // 0;
    value: string; // "0.00980175";
    address: string | null; // "19Hb9HH2QK5v38NAwQuEmLwngu5HJqqRjm";
    type: string; // "pubkeyhash";
    script: { hex: string; asm: string };
    spent: { hash: string; index: number } | null;
  }>;
  size: number;
  version: number; // 1;
  locktime: number; // 0;
}

// Unspent outputs come ten to a page; a shorter page is the last one.
const UTXOS_PER_PAGE = 10;

const fetchHeight = async (network: string): Promise<number> => {
  const url = `https://sochain.com/api/v3/network_info/${network}`;
  const response = await axios.get<{
    readonly data: { readonly block_count: number };
  }>(url, { timeout: DEFAULT_TIMEOUT });

  return response.data.data.block_count;
};

const fetchUTXO = (network: string) => async (
  txHash: string,
  vOut: number
): Promise<UTXO> => {
  const url = `https://sochain.com/api/v3/transaction/${network}/${txHash}`;
  const response = await axios.get<{
    readonly data: SoChainTX;
  }>(url, { timeout: DEFAULT_TIMEOUT });

  const tx = response.data.data;

  return fixUTXO(
    {
      txHash: tx.hash,
      amount: parseFloat(tx.outputs[vOut].value),
      // scriptPubKey: tx.outputs[vOut].script.hex,
      vOut,
      confirmations: tx.confirmations,
    },
    8
  );
};

const fetchUTXOs = (network: string) => async (
  address: string,
  confirmations: number
): Promise<UTXO[]> => {
  const utxos: SoChainUTXO[] = [];
  for (let page = 1; ; page++) {
    const url = `https://sochain.com/api/v3/unspent_outputs/${network}/${address}/${page}`;
    const response = await axios.get<{
      readonly data: { readonly outputs: readonly SoChainUTXO[] };
    }>(url, { timeout: DEFAULT_TIMEOUT });

    utxos.push(...response.data.data.outputs);
    if (response.data.data.outputs.length < UTXOS_PER_PAGE) {
      break;
    }
  }

  const height = await fetchHeight(network);

  return fixUTXOs(
    utxos.map(utxo => ({
      txHash: utxo.hash,
      amount: parseFloat(utxo.value),
      // scriptPubKey: utxo.script,
      vOut: utxo.index,
      confirmations: utxo.block === null ? 0 : 1 + height - utxo.block,
    })),
    8
  )
    .filter(utxo => confirmations === 0 || utxo.confirmations >= confirmations)
    .sort(sortUTXOs);
};

const fetchTXs = (network: string) => async (
  address: string,
  confirmations: number = 0
): Promise<UTXO[]> => {
  const url = `https://sochain.com/api/v3/transactions/${network}/${address}`;
  const response = await axios.get<{
    readonly data: { readonly transactions: readonly SoChainAddressTX[] };
  }>(url, { timeout: DEFAULT_TIMEOUT });

  const height = await fetchHeight(network);

  // v3 lists the newest transactions, each with what the address received in
  // it, rather than single outputs, so these entries have no vOut.
  return fixUTXOs(
    response.data.data.transactions
      .filter(tx => parseFloat(tx.value_received) > 0)
      .map(tx => ({
        txHash: tx.hash,
        amount: parseFloat(tx.value_received),
        confirmations: tx.block === null ? 0 : 1 + height - tx.block,
      })),
    8
  )
    .filter(utxo => confirmations === 0 || utxo.confirmations >= confirmations)
    .sort(sortUTXOs);
};

export const Sochain = {
  fetchUTXOs,
  fetchUTXO,
  fetchTXs,
};
