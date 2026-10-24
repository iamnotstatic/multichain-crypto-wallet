import { TonClient } from '@ton/ton';

const provider = (rpcUrl?: string, apiKey?: string) => {
  return new TonClient({
    endpoint: rpcUrl as string,
    apiKey: apiKey as string
  });
};

export default provider;
