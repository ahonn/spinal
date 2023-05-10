import type { ConnecterData } from './base';
import { Connector } from './base';
import { helpers } from '@ckb-lumos/lumos';

type MethodNames =
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

  public async connect(): Promise<ConnecterData> {
    const provider = this.getProvider();
    if (!provider) {
      throw new Error('// TODO: throw error');
    }
    await provider!.request({ method: 'wallet_enable' });

    const offChainLocks = await provider!.request({
      method: 'wallet_fullOwnership_getOffChainLocks',
      params: { change: 'external' },
    });
    const [lock] = offChainLocks;
    const address = helpers.encodeToAddress(lock);
    return {
      address,
    };
  }
}
