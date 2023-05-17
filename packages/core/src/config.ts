import type { ConnecterData, Connector } from './connectors/base';
import { getDefaultStore } from 'jotai';
import { connectAtom, connectorAtom } from './store/connect';
import { connect } from './actions';
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

  private chains: Chain[];
  public autoConnect: boolean;
  public store: ReturnType<typeof getDefaultStore>;
  public connectors: Connector[];

  constructor(params: CreateConfigParameters) {
    this.autoConnect = params.autoConnect ?? false;
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

    this.store.sub(connectorAtom, () => {
      const connector = this.store.get(connectorAtom);
      if (this.autoConnect && connector) {
        connect({ connector });
      }
    });
  }

  public static create(params: CreateConfigParameters) {
    if (!Config.instance) {
      Config.instance = new Config(params);
    }
    return Config.instance;
  }

  public get connector(): Connector | undefined {
    return this.store.get(connectorAtom);
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

  public addConnector(connector: Connector) {
    if (!this.connectors.some((conn) => conn.id === connector.id)) {
      this.connectors.push(connector);
    }
    if (!this.connector) {
      this.store.set(connectorAtom, this.connectors[0]);
    }
  }

  public setActiveConnector(connector: Connector) {
    this.addConnector(connector);
    this.store.set(connectorAtom, connector);
  }

  public getConnectData(connector?: Connector): ConnecterData | undefined {
    return this.store.get(connectAtom(connector?.id ?? this.connector?.id));
  }

  public onConnectorChange(callback: (connector?: Connector) => void) {
    this.store.sub(connectorAtom, () => {
      callback(this.connector);
    });
  }

  public onConnectDataChange(connector: Connector, callback: (data?: ConnecterData) => void) {
    this.store.sub(connectAtom(connector.id), () => {
      callback(this.getConnectData(connector));
    });
  }

  public resetStore() {
    this.connectors.forEach((connector) => {
      this.store.set(connectAtom(connector.id), undefined);
    });
    this.store.set(chainAtom, undefined);
  }
}

export function getConfig(): Config {
  return Config.instance;
}
