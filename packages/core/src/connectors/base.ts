export interface ConnecterData {
  address: string;
}

export abstract class Connector {
  abstract id: string;
  abstract connect(): Promise<ConnecterData>;
}
