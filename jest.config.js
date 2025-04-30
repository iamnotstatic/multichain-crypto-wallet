const config = {
  testTimeout: 100000,
  moduleNameMapper: {
    '^axios$': 'axios/dist/axios.js',
  },
  globals: {
    'ts-jest': {
      isolatedModules: true,
      useESM: true,
    },
  },
  preset: 'ts-jest/presets/default-esm',
  setupFiles: ['./jest.setup.js'],
  transform: {
    '^.+\\.(ts|js)$': ['babel-jest', { 
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript'
      ],
    }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@mysten/sui|valibot)/)'
  ],
};

module.exports = config;
