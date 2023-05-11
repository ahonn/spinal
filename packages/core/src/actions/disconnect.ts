import { getConfig } from 'src/config';
import { connectAtom } from 'src/store';

export function disconnect() {
  const config = getConfig();
  if (config.connector) {
    config.connector.disconnect();
  }

  config.store.set(connectAtom, undefined);
}
