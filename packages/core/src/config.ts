import { getDefaultStore } from 'jotai';
import type { Connector } from './connectors/base';
import type { ConnectState } from './store/connect';
import { connect } from './actions/connect';
import { connectAtom } from './store/connect';
import { Chain, testnet } from './chains';
import { Indexer, RPC, config as lumosConfig } from '@ckb-lumos/lumos';
import { chainAtom } from './store/chain';

export type CreateConfigParameters = {
  autoConnect?: boolean;
  connectors?: Connector[];
  chains: Chain[];
};

export class Config {
  public static instance: Config;

  private params: CreateConfigParameters;
  public chains: Chain[];
  public store: ReturnType<typeof getDefaultStore>;
  public connectors: Connector[];

  constructor(params: CreateConfigParameters) {
    this.params = params;
    this.chains = params.chains;
    this.connectors = params.connectors || [];
    this.store = getDefaultStore();

    const chain = this.store.get(chainAtom) ?? this.chains[0] ?? testnet;
    if (this.store.get(chainAtom)?.name !== chain.name) {
      this.store.set(chainAtom, chain);
    }

    lumosConfig.initializeConfig(this.chain);
    this.store.sub(chainAtom, () => {
      const chain = this.store.get(chainAtom);
      lumosConfig.initializeConfig(chain);
    });

    if (params.autoConnect && typeof window !== undefined) {
      setTimeout(() => this.autoConnect(), 0);
    }
  }

  public static create(params: CreateConfigParameters) {
    if (!Config.instance) {
      Config.instance = new Config(params);
    }
    return Config.instance;
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
    const chain = this.store.get(chainAtom)!;
    return chain;
  }

  public get rpcClient(): RPC {
    return new RPC(this.chain.urls.public.rpc);
  }

  public get indexer(): Indexer {
    return new Indexer(this.chain.urls.public.indexer);
  }

  public setConnector(connector: Connector) {
    if (!this.connectors.some((conn) => conn.id === connector.id)) {
      this.connectors.push(connector);
    }
    this.store.set(connectAtom, { connector, data: undefined, status: 'disconnect' });
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

  public resetStore() {
    this.store.set(connectAtom, undefined);
    this.store.set(chainAtom, undefined);
  }
}

export function getConfig(): Config {
  return Config.instance;
}
