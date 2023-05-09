import type { Indexer, RPC } from '@ckb-lumos/lumos';
import type { Connector } from './connectors/base';

export type CreateConfigParameters<
  TRpcClient extends RPC = RPC,
  TIndexer extends Indexer = Indexer,
> = {
  autoConnect?: boolean;
  connectors?: (() => Connector[]) | Connector[];
  rpcClient: ((config: { name?: string }) => TRpcClient) | TRpcClient;
  indexer?: ((config: { name?: string }) => TIndexer | undefined) | TIndexer;
};

class Config {
  public rpcClient: CreateConfigParameters['rpcClient'];
  public indexer: CreateConfigParameters['indexer'];

  constructor(params: CreateConfigParameters) {
    this.rpcClient = params.rpcClient;
    this.indexer = params.indexer;

    if (params.autoConnect && typeof window !== undefined) {
      setTimeout(() => this.autoConnect(), 0);
    }
  }

  private autoConnect() {
    // TODO
  }
}

export function createConfig(params: CreateConfigParameters) {
  const config = new Config(params);
  return config;
}
