import { BI } from '@ckb-lumos/lumos';
import { getConfig } from 'src/config';

export async function getCapacities() {
  const config = getConfig();
  const activeConnector = config.connector;
  if (!activeConnector) {
    return BI.from(0);
  }

  const capacities = await activeConnector.getCapacities();
  return capacities;
}
