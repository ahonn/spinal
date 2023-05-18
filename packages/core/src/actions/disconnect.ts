import { getConfig } from 'src/config';

export function disconnect() {
  const config = getConfig();
  config.disconnect();
}
