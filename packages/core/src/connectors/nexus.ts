import type { ConnecterData } from './base';
import type { Cell } from '@ckb-lumos/lumos';
import { Connector } from './base';
import { BI, helpers } from '@ckb-lumos/lumos';
import { getConfig } from 'src/config';

type MethodNames =
  | 'ckb_getBlockchainInfo'
  | 'wallet_enable'
  | 'wallet_fullOwnership_getLiveCells'
  | 'wallet_fullOwnership_getOffChainLocks'
  | 'wallet_fullOwnership_getOnChainLocks'
  | 'wallet_fullOwnership_signData'
  | 'wallet_fullOwnership_signTransaction';

declare global {
  interface Window {
    ckb: {
      request: (payload: { method: MethodNames; params?: any }) => Promise<any>;
    };
  }
}

export class NexusConnentor extends Connector {
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
    const liveCells: Cell[] = [];
    const provider = this.getProvider();
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

    return liveCells.filter(
      (item: Cell) =>
        item.cellOutput.type === undefined &&
        item.data === '0x' &&
        // secp256k1 code hash, refer to:
        // https://github.com/nervosnetwork/rfcs/blob/5ccfef8a5e51c6f13179452d3589f247eae55554/rfcs/0024-ckb-genesis-script-list/0024-ckb-genesis-script-list.md#secp256k1blake160
        item.cellOutput.lock.codeHash === '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8' &&
        item.cellOutput.lock.hashType === 'type',
    );
  }

  public async connect(): Promise<ConnecterData> {
    const provider = this.getProvider();
    if (!provider) {
      throw new Error('Nexus Wallet not found');
    }
    await provider!.request({ method: 'wallet_enable' });
    const config = getConfig();

    const offChainLocks = await provider!.request({
      method: 'wallet_fullOwnership_getOffChainLocks',
      params: { change: 'external' },
    });
    const [lock] = offChainLocks;
    const address = helpers.encodeToAddress(lock, { config: config.chain });
    return {
      address,
      chain: config.chain,
    };
  }

  async disconnect(): Promise<void> {
    return;
  }

  async getCapacities(): Promise<BI> {
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
}
