import { IResponse } from './types';
import * as base64 from 'base64-js';

export const successResponse = (args: IResponse) => {
  return args;
};

/**
 * Remove 0x prefix from a hex string. If the input doesn't have a 0x prefix,
 * it's returned unchanged.
 *
 * @param hex The hex value to be prefixed.
 */
export const strip0x = (hex: string): string => {
  return hex.substring(0, 2) === '0x' ? hex.slice(2) : hex;
};

/**
 * Convert a Uint8Array to a hex string (with no "0x"-prefix).
 */
export const toHex = (array: Uint8Array): string =>
  array.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

/**
 * Add a 0x prefix to a hex value, converting to a string first. If the input
 * is already prefixed, it's returned unchanged.
 *
 * @param hexInput The hex value to be prefixed.
 */
export const Ox = (
  hexInput: Uint8Array | string | number,
  { prefix } = { prefix: '0x' }
): string => {
  let hexString: string =
    hexInput instanceof Uint8Array
      ? toHex(hexInput)
      : typeof hexInput === 'number'
      ? hexInput.toString(16)
      : hexInput;

  if (hexString.length % 2 === 1) {
    hexString = '0' + hexString;
  }
  return hexString.substring(0, 2) === prefix
    ? hexString
    : `${prefix}${hexString}`;
};

/**
 * Convert a hex string to a Uint8Array.
 */
export const fromHex = (hexString: string): Uint8Array => {
  // Strip "0x" prefix.
  hexString = strip0x(hexString);

  // Pad the hex string.
  if (hexString.length % 2) {
    hexString = '0' + hexString;
  }

  // Split the string into bytes.
  const match = hexString.match(/.{1,2}/g);
  if (!match) {
    return new Uint8Array();
  }

  // Parse each byte and create a Uint8Array.
  return new Uint8Array(match.map(byte => parseInt(byte, 16)));
};

/**
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/12646864#12646864
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
export const shuffleArray = <T>(...arrayIn: T[] | T[][]): T[] => {
  const array: T[] =
    arrayIn.length === 1 && Array.isArray(arrayIn[0])
      ? (arrayIn[0] as T[])
      : (arrayIn as T[]);

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

export const toUTF8String = (input: Uint8Array): string => {
  let TextDecoderConstructor =
    (window || {}).TextDecoder || require('util').TextDecoder;
  const textDecoder = new TextDecoderConstructor();
  return textDecoder.decode(input);
};

export const fromUTF8String = (input: string): Uint8Array => {
  let TextEncoderConstructor =
    (window || {}).TextEncoder || require('util').TextEncoder;
  const textEncoder = new TextEncoderConstructor();
  return textEncoder.encode(input);
};

/**
 * Convert a base64 string to a Uint8Array.
 */
export const fromBase64 = (base64String: string): Uint8Array => {
  return base64.toByteArray(base64String);
};

export const toBase64 = (input: Uint8Array): string => {
  return base64.fromByteArray(input);
};
