import { config } from '@ckb-lumos/lumos';

export interface RpcUrl {
  node: string;
  indexer: string;
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
      node: 'https://mainnet.ckbapp.dev',
      indexer: 'https://mainnet.ckbapp.dev/indexer',
    },
  },
};

export const testnet: Chain = {
  ...config.predefined.AGGRON4,
  name: 'pudge',
  network: 'ckb_testnet',
  rpcUrls: {
    public: {
      node: 'https://testnet.ckbapp.dev',
      indexer: 'https://testnet.ckbapp.dev/indexer',
    },
  },
};
