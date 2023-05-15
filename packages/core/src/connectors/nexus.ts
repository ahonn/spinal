import type { ConnecterData } from './base';
import { BI, Cell, Transaction, helpers } from '@ckb-lumos/lumos';
import { Connector } from './base';
import { getConfig } from 'src/config';
import { bytes } from '@ckb-lumos/codec';
import { blockchain } from '@ckb-lumos/base';
import { FullOwnershipProvider } from '@nexus-wallet/ownership-providers';
import { Events, InjectedCkb, RpcMethods } from '@nexus-wallet/protocol';
import { getScriptCellDep } from './utils';

declare global {
  interface Window {
    ckb: InjectedCkb<RpcMethods, Events>;
  }
}

export const SECP256K1_BLAKE160_WITNESS_PLACEHOLDER = bytes.hexify(
  blockchain.WitnessArgs.pack({
    lock: bytes.hexify(new Uint8Array(65)),
  }),
);

export class NexusConnector extends Connector {
  public id = 'nexus';

  private getProvider(): Window['ckb'] | null {
    if (typeof window === 'undefined') {
      return null;
    }
    const ckb = window?.ckb;
    if (!ckb) {
      return null;
    }
    return ckb;
  }

  private async getLiveCells(): Promise<Cell[]> {
    const provider = this.getProvider();
    const config = getConfig();
    const liveCells: Cell[] = [];
    if (!provider) {
      return liveCells;
    }

    let response = await provider.request({ method: 'wallet_fullOwnership_getLiveCells', params: {} });
    liveCells.push(...response.objects);
    while (response.cursor) {
      response = await provider.request({
        method: 'wallet_fullOwnership_getLiveCells',
        params: { cursor: response.cursor },
      });
      liveCells.push(...response.objects);
    }

    const script = config.chain.SCRIPTS['SECP256K1_BLAKE160']!;
    return liveCells.filter(
      (item: Cell) =>
        item.cellOutput.type === undefined &&
        item.data === '0x' &&
        item.cellOutput.lock.codeHash === script.CODE_HASH &&
        item.cellOutput.lock.hashType === script.HASH_TYPE,
    );
  }

  public async connect(): Promise<ConnecterData> {
    const provider = this.getProvider();
    if (!provider) {
      throw new Error('Nexus Wallet not found');
    }
    await provider!.request({ method: 'wallet_enable' });
    const config = getConfig();

    const externalOffChainLocks = await provider!.request({
      method: 'wallet_fullOwnership_getOffChainLocks',
      params: { change: 'external' },
    });
    const [lock] = externalOffChainLocks;
    const address = helpers.encodeToAddress(lock!);
    return {
      address,
      chain: config.chain,
    };
  }

  public async disconnect(): Promise<void> {
    return;
  }

  public async getCapacities(): Promise<BI> {
    let capacities = BI.from(0);
    const provider = this.getProvider();
    if (!provider) {
      return capacities;
    }
    const liveCells = await this.getLiveCells();
    liveCells.forEach((cell) => {
      capacities = capacities.add(cell.cellOutput.capacity);
    });

    return capacities;
  }

  public async getLockScript() {
    const provider = this.getProvider();
    const internalOffChainLocks = await provider!.request({
      method: 'wallet_fullOwnership_getOffChainLocks',
      params: { change: 'internal' },
    });
    const [lock] = internalOffChainLocks;
    return lock!;
  }

  public async injectCapacity(
    tx: helpers.TransactionSkeletonType,
    neededCapacity: BI,
  ): Promise<helpers.TransactionSkeletonType> {
    const provider = this.getProvider();
    const fullOwnershipProvider = new FullOwnershipProvider({ ckb: provider! });
    tx = await fullOwnershipProvider.injectCapacity(tx, { amount: neededCapacity });
    return tx;
  }

  public async signTransaction(tx: helpers.TransactionSkeletonType): Promise<Transaction> {
    const provider = this.getProvider();
    const fullOwnershipProvider = new FullOwnershipProvider({ ckb: provider! });
    // fix fullOwnershipProvider cellDep: 0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c
    tx = tx.update('cellDeps', (cellDeps) => cellDeps.pop().push(getScriptCellDep('SECP256K1_BLAKE160')));
    tx = await fullOwnershipProvider.signTransaction(tx);
    const signedTx = helpers.createTransactionFromSkeleton(tx);
    return signedTx;
  }
}
