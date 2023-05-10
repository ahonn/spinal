import type { Indexer, RPC } from '@ckb-lumos/lumos';
import type { Connector } from './connectors/base';
import { getDefaultStore } from 'jotai';
import { connectAtom } from './store/connect';

export type CreateConfigParameters<
  TRpcClient extends RPC = RPC,
  TIndexer extends Indexer = Indexer,
> = {
  autoConnect?: boolean;
  connectors?: (() => Connector[]) | Connector[];
  rpcClient: ((config: { name: string }) => TRpcClient) | TRpcClient;
  indexer?: ((config: { name: string }) => TIndexer | undefined) | TIndexer;
};

export class Config {
  public rpcClient: CreateConfigParameters['rpcClient'];
  public indexer: CreateConfigParameters['indexer'];
  public store: ReturnType<typeof getDefaultStore>;

  constructor(params: CreateConfigParameters) {
    this.rpcClient = params.rpcClient;
    this.indexer = params.indexer;

    this.store = getDefaultStore();

    if (params.autoConnect && typeof window !== undefined) {
      setTimeout(() => this.autoConnect(), 0);
    }
  }

  private autoConnect() {
    // TODO
  }

  public get connector(): Connector | undefined {
    const connectState = this.store.get(connectAtom);
    return connectState.connector;
  }
}

let config: Config;

export function createConfig(params: CreateConfigParameters) {
  config = new Config(params);
  return config;
}

export function getConfig(): Config {
  return config;
}
