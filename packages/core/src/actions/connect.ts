import { getConfig } from 'src/config';
import type { Connector } from 'src/connectors/base';
import { connectAtom } from 'src/store/connect';

export interface ConnectArgs {
  connector: Connector;
}

export async function connect({ connector }: ConnectArgs) {
  const config = getConfig();
  const data = await connector.connect();
  config.store.set(connectAtom(connector.id), data);

  return {
    connector,
    data,
  };
}
