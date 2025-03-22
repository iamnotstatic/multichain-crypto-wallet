const crypto = require('crypto');

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: arr => crypto.randomFillSync(arr),
  },
});

try {
  const noble = require('@noble/hashes/utils');
  if (noble) {
    noble.randomBytes = length => {
      return crypto.randomBytes(length);
    };
  }
} catch (e) {
  console.warn('Could not patch @noble/hashes');
}
