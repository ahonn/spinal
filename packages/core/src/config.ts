import { getDefaultStore } from 'jotai';
import type { Connector } from './connectors/base';
import type { ConnectState } from './store/connect';
import { connect } from './actions/connect';
import { connectAtom } from './store/connect';
import { Chain, testnet } from './chains';
import { Indexer, RPC } from '@ckb-lumos/lumos';
import { chainAtom } from './store/chain';

export type CreateConfigParameters = {
  autoConnect?: boolean;
  connectors?: Connector[];
  chains: [Chain];
};

export class Config {
  private params: CreateConfigParameters;
  public chains: Chain[];
  public rpcClient: RPC;
  public indexer: Indexer;
  public store: ReturnType<typeof getDefaultStore>;
  public connectors: Connector[];

  constructor(params: CreateConfigParameters) {
    this.params = params;
    this.chains = params.chains;
    this.connectors = params.connectors || [];
    this.store = getDefaultStore();

    this.rpcClient = new RPC(this.chain.rpcUrls.public.node);
    this.indexer = new Indexer(this.chain.rpcUrls.public.indexer);
    this.store.sub(chainAtom, () => {
      this.rpcClient = new RPC(this.chain.rpcUrls.public.node);
      this.indexer = new Indexer(this.chain.rpcUrls.public.indexer);
    });

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
    const connector = this.connectors.find((connector) => connector.id === connectState.connector?.id);
    return connector;
  }

  public get chain(): Chain {
    const chain = this.store.get(chainAtom) ?? this.chains[0] ?? testnet;
    if (this.store.get(chainAtom)?.name !== chain.name) {
      this.store.set(chainAtom, chain);
    }
    return chain;
  }

  public addConnector(connector: Connector) {
    if (this.connectors.some((conn) => conn.id === connector.id)) {
      return;
    }
    this.connectors.push(connector);
    if (this.params.autoConnect) {
      this.autoConnect();
    }
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
