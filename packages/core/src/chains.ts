import { config } from '@ckb-lumos/lumos';

export interface RpcUrl {
  node: string;
  indexer: string;
  mercury: string;
}

export type Chain = config.Config & {
  name: string;
  rpcUrls: {
    public: RpcUrl;
  };
};

export const mainnet: Chain = {
  ...config.predefined.LINA,
  name: 'lina',
  rpcUrls: {
    public: {
      node: 'mainnet.ckbapp.dev',
      indexer: 'mainnet.ckbapp.dev/indexer',
      mercury: 'mercury-mainnet.ckbapp.dev',
    },
  },
};

export const testnet: Chain = {
  ...config.predefined.AGGRON4,
  name: 'aggron4',
  rpcUrls: {
    public: {
      node: 'testnet.ckbapp.dev',
      indexer: 'testnet.ckbapp.dev/indexer',
      mercury: 'mercury-testnet.ckbapp.dev',
    },
  },
};
