import { BI, Cell, helpers } from '@ckb-lumos/lumos';
import { getConfig } from 'src/config';

const TX_FEE = BI.from(100000);

export async function sendTransaction(to: string, amount: string) {
  const config = getConfig();
  const connectState = config.getConnectState();
  if (connectState.status !== 'connected') {
    throw new Error('Please connect wallet first');
  }
  const { address } = connectState.data!;

  let tx = helpers.TransactionSkeleton({});
  const fromScript = helpers.parseAddress(address, { config: config.chain });
  const toScript = helpers.parseAddress(to, { config: config.chain });

  const neededCapacity = BI.from(amount).add(TX_FEE);
  let capacities = BI.from(0);
  const inputCells: Cell[] = [];
  const collector = config.indexer.collector({ lock: fromScript, type: 'empty' });
  for await (const cell of collector.collect()) {
    capacities = capacities.add(cell.cellOutput.capacity);
    inputCells.push(cell);
    if (BI.from(capacities).gte(neededCapacity)) break;
  }

  if (capacities.lt(neededCapacity)) {
    throw new Error('Not enough capacity');
  }

  const transferOutputCell = {
    cellOutput: {
      capacity: BI.from(amount).toHexString(),
      lock: toScript,
    },
    data: '0x',
  };

  const minimalCapacity = helpers.minimalCellCapacity(transferOutputCell);
  if (BI.from(amount).lt(minimalCapacity)) {
    throw new Error(`Amount must be larger than ${minimalCapacity}`);
  }

  const changeOutputCell = {
    cellOutput: {
      capacity: capacities.sub(neededCapacity).toHexString(),
      lock: fromScript,
    },
    data: '0x',
  };

  tx = tx.update('inputs', (inputs) => inputs.push(...inputCells));
  tx = tx.update('outputs', (outputs) => outputs.push(transferOutputCell, changeOutputCell));

  const signedTx = await config.connector!.signTransaction(tx);
  const txHash = await config.rpcClient.sendTransaction(signedTx, 'passthrough');

  return txHash;
}
