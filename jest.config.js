const config = {
  testTimeout: 100000, 
  moduleNameMapper: {
    '^axios$': 'axios/dist/axios.js',
  },
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  setupFiles: ['./jest.setup.js'],
};

module.exports = config;
