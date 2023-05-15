import { BI } from '@ckb-lumos/lumos';

export interface ConnecterData {
  address: string;
}

export interface Connector {
  getCapacities?(): Promise<BI>;
}

export abstract class Connector {
  abstract id: string;
  abstract connect(): Promise<ConnecterData>;
  abstract disconnect(): Promise<void>;
}
