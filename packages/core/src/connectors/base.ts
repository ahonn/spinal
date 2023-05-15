import { BI, Transaction, helpers } from '@ckb-lumos/lumos';
import { Chain } from 'src/chains';

export interface ConnecterData {
  address: string;
  chain: Chain;
}

export interface Connector {
  getCapacities?(): Promise<BI>;
}

export abstract class Connector {
  abstract id: string;
  abstract connect(): Promise<ConnecterData>;
  abstract signTransaction(tx: helpers.TransactionSkeletonType): Promise<Transaction>;
  abstract disconnect(): Promise<void>;
}
