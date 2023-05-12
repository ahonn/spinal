import { BI, helpers } from '@ckb-lumos/lumos';
import { testnet } from 'src/chains';
import { getConfig } from 'src/config';

export async function getCapacities() {
  const config = getConfig();
  const activeConnector = config.connector;
  if (!activeConnector) {
    return BI.from(0);
  }

  if (activeConnector.getCapacities) {
    const capacities = await activeConnector.getCapacities();
    return capacities;
  }

  const { data } = config.getConnectState();
  const indexer = config.indexer({ name: testnet.name });
  if (!indexer) {
    // FIXME: throw error
    return BI.from(0);
  }

  const collector = indexer.collector({
    lock: helpers.parseAddress(data!.address, { config: testnet }),
  });

  let capacities = BI.from(0);
  for await (const cell of collector.collect()) {
    capacities = capacities.add(cell.cellOutput.capacity);
  }
  return capacities;
}
