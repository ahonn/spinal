import { BI, Transaction, helpers } from '@ckb-lumos/lumos';
import { AuthResponseData, authWithPopup } from '@joyid/core';
import { ConnecterData, Connector } from './base';
import { testnet } from 'src/chains';

export class JoyIdConnector extends Connector {
  public id = 'JoyId';

  public async connect(): Promise<ConnecterData<AuthResponseData | undefined>> {
    const res = await authWithPopup({
      redirectURL: location.origin + '/',
    });
    if (res.error) {
      throw new Error(res.error);
    }
    return {
      address: res.data!.address,
      chain: testnet, // TODO: waiting for Joy ID support mainnet
      data: res.data,
    };
  }

  public async disconnect(): Promise<void> {
    return;
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
