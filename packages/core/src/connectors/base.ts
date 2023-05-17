import { BI, Script, Transaction, helpers } from '@ckb-lumos/lumos';
import { Chain } from 'src/chains';
import { getConfig } from 'src/config';

export interface ConnecterData {
  address: string;
  chain: Chain;
}

export interface Connector {
  getCapacities?(): Promise<BI>;
  getLockScript?(): Promise<Script>;
}

export abstract class Connector {
  abstract id: string;
  abstract getProvider(): any;
  abstract connect(): Promise<ConnecterData>;
  abstract injectCapacity(
    tx: helpers.TransactionSkeletonType,
    neededCapacity: BI,
  ): Promise<helpers.TransactionSkeletonType>;
  abstract signTransaction(tx: helpers.TransactionSkeletonType): Promise<Transaction>;
  abstract disconnect(): Promise<void>;

  protected getData() {
    const config = getConfig();
    const data = config.getConnectData();
    return data;
  }
}
