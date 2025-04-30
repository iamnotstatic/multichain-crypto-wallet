const crypto = require('crypto');
const { TextEncoder, TextDecoder } = require('util');
const fetch = require('node-fetch');

// Add TextEncoder/TextDecoder to global
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.fetch = fetch;

// Setup crypto
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: arr => crypto.randomFillSync(arr),
    subtle: crypto.subtle
  },
});

// Patch @noble/hashes
try {
  const noble = require('@noble/hashes/utils');
  if (noble) {
    noble.randomBytes = (length) => crypto.randomBytes(length);
  }
} catch (e) {
  console.warn('Could not patch @noble/hashes');
}
