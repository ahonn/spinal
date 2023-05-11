import { getConfig } from 'src/config';
import type { Connector } from 'src/connectors/base';
import { connectAtom } from 'src/store/connect';

export interface ConnectArgs {
  connector: Connector;
}

export async function connect({ connector }: ConnectArgs) {
  const config = getConfig();
  const connectState = config.store.get(connectAtom);

  const activeConnector = config.connector;
  const isConnected = connectState.status === 'connected';

  if (connector!.id === activeConnector?.id && isConnected) {
    return;
  }

  config.store.set(connectAtom, {
    status: 'connecting',
  });
  const data = await connector.connect();
  config.store.set(connectAtom, {
    connector,
    data,
    status: 'connected',
  });

  return {
    connector,
    data,
  };
}
