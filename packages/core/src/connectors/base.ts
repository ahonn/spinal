import { BI } from "@ckb-lumos/lumos";

export interface ConnecterData {
  address: string;
}

export abstract class Connector {
  abstract id: string;
  abstract connect(): Promise<ConnecterData>;
  abstract disconnect(): Promise<void>;
  abstract getCapacities(): Promise<BI>;
}
