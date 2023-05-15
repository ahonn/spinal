import { getConfig } from 'src/config';

export function disconnect() {
  const config = getConfig();
  if (config.connector) {
    config.connector.disconnect();
  }

  config.resetStore();
}
