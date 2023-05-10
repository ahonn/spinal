import { getDefaultStore } from 'jotai';
import type { Indexer, RPC } from '@ckb-lumos/lumos';
import type { Connector } from './connectors/base';
import type { ConnectState } from './store/connect';
import { connect } from './actions/connect';
import { connectAtom } from './store/connect';
import { NexusConnentor } from './connectors/nexus';

export type CreateConfigParameters<
  TRpcClient extends RPC = RPC,
  TIndexer extends Indexer = Indexer,
> = {
  autoConnect?: boolean;
  connectors?: Connector[];
  rpcClient: ((config: { name: string }) => TRpcClient) | TRpcClient;
  indexer?: ((config: { name: string }) => TIndexer | undefined) | TIndexer;
};

export const DEFAULT_CONNECTORS = [new NexusConnentor()];

export class Config {
  public rpcClient: CreateConfigParameters['rpcClient'];
  public indexer: CreateConfigParameters['indexer'];
  public store: ReturnType<typeof getDefaultStore>;
  public connectors: Connector[];

  constructor(params: CreateConfigParameters) {
    this.rpcClient = params.rpcClient;
    this.indexer = params.indexer;

    this.connectors = params.connectors || DEFAULT_CONNECTORS;

    this.store = getDefaultStore();

    if (params.autoConnect && typeof window !== undefined) {
      setTimeout(() => this.autoConnect(), 0);
    }
  }

  private autoConnect() {
    if (this.connector) {
      connect({ connector: this.connector });
    }
  }

  public get connector(): Connector | undefined {
    const connectState = this.store.get(connectAtom);
    const connector = this.connectors.find(
      (connector) => connector.id === connectState.connector?.id,
    );
    return connector;
  }

  public getConnectState(): ConnectState {
    return this.store.get(connectAtom);
  }

  public onConnectChange(onChange: (state: ConnectState) => void) {
    this.store.sub(connectAtom, () => {
      const connectState = this.store.get(connectAtom);
      onChange(connectState);
    });
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
