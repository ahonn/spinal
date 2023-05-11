import { config } from '@ckb-lumos/lumos';

export interface RpcUrl {
  node: string;
  indexer: string;
  mercury: string;
}

export type Chain = config.Config & {
  name: string;
  network: string;
  rpcUrls: {
    public: RpcUrl;
  };
};

export const mainnet: Chain = {
  ...config.predefined.LINA,
  name: 'mirana',
  network: 'ckb',
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
  name: 'pudge',
  network: 'ckb_testnet',
  rpcUrls: {
    public: {
      node: 'testnet.ckbapp.dev',
      indexer: 'testnet.ckbapp.dev/indexer',
      mercury: 'mercury-testnet.ckbapp.dev',
    },
  },
};
