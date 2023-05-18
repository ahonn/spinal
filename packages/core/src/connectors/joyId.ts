import { BI, Transaction, helpers } from '@ckb-lumos/lumos';
import { AuthResponseData, authWithPopup } from '@joyid/core';
import { ConnectorData, Connector } from './base';
import { testnet } from 'src/chains';

export class JoyIdConnector extends Connector {
  public id = 'JoyID';
  private data: ConnectorData<AuthResponseData | undefined> | undefined;

  public async connect(): Promise<ConnectorData<AuthResponseData | undefined>> {
    if (this.data) {
      return this.data;
    }
    const res = await authWithPopup({
      redirectURL: location.origin + '/',
    });
    if (res.error) {
      throw new Error(res.error);
    }
    const data = {
      address: res.data!.address,
      chain: testnet, // TODO: waiting for Joy ID support mainnet
      data: res.data,
    };
    this.data = data;
    return data;
  }

  public async injectCapacity(
    tx: helpers.TransactionSkeletonType,
    neededCapacity: BI,
  ): Promise<helpers.TransactionSkeletonType> {
    console.log(neededCapacity);
    return tx;
  }

  public async signTransaction(tx: helpers.TransactionSkeletonType): Promise<Transaction> {
    return helpers.createTransactionFromSkeleton(tx);
  }
}
