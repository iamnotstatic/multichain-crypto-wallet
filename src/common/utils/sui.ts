import { SuiClient } from '@mysten/sui/client';

const provider = (rpcUrl?: string) => {
  return new SuiClient({
    url: rpcUrl as string,
  });
};

export default provider;
