import { getConfig } from 'src/config';
import type { Connector } from 'src/connectors/base';

export interface ConnectArgs {
  connector: Connector;
}

export function connect({ connector }: ConnectArgs) {
  const config = getConfig();
  const activeConnector = config.connector;
  if (connector!.id === activeConnector?.id) {
    throw new Error('// TODO: AlreadyConnectedError');
  }
}
