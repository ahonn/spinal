import { commons, helpers } from '@ckb-lumos/lumos';
import { ConnecterData, Connector } from './base';
import { EIP1193Provider } from 'viem';
import { getConfig } from 'src/config';

declare global {
  interface Window {
    ethereum: EIP1193Provider & {
      isMetaMask?: boolean;
    };
  }
}

export class MetamaskConnector extends Connector {
  public id = 'metamask';

  private getProvider(): Window['ethereum'] | null {
    if (typeof window === 'undefined') {
      return null;
    }
    const ethereum = window?.ethereum;
    if (!ethereum || !ethereum.isMetaMask) {
      return null;
    }
    return ethereum;
  }

  public async connect(): Promise<ConnecterData> {
    const provider = this.getProvider();
    const config = getConfig();
    const accounts = await provider?.request({ method: 'eth_requestAccounts' });
    const ethAddr = accounts![0];
    const omniLockScript = commons.omnilock.createOmnilockScript({ auth: { flag: 'ETHEREUM', content: ethAddr! } });
    const address = helpers.encodeToAddress(omniLockScript, { config: config.chain });

    return {
      address,
      chain: config.chain,
    };
  }

  public async disconnect(): Promise<void> {
    return;
  }
}
