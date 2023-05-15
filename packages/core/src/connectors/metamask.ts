import type { CellDep } from '@ckb-lumos/lumos';
import { Transaction, commons, helpers } from '@ckb-lumos/lumos';
import { ConnecterData, Connector } from './base';
import { Address, EIP1193Provider, Hex } from 'viem';
import { getConfig } from 'src/config';
import { bytes } from '@ckb-lumos/codec';
import { blockchain } from '@ckb-lumos/base';

declare global {
  interface Window {
    ethereum: EIP1193Provider & {
      isMetaMask?: boolean;
      selectedAddress: Address;
    };
  }
}

const SECP_SIGNATURE_PLACEHOLDER = bytes.hexify(
  new Uint8Array(
    commons.omnilock.OmnilockWitnessLock.pack({
      signature: new Uint8Array(65).buffer,
    }).byteLength,
  ),
);

function getScriptCellDep(name: string): CellDep {
  const config = getConfig();
  const script = config.chain.SCRIPTS[name];
  return {
    outPoint: {
      txHash: script!.TX_HASH,
      index: script!.INDEX,
    },
    depType: script!.DEP_TYPE,
  };
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
    const omniLockScript = commons.omnilock.createOmnilockScript(
      { auth: { flag: 'ETHEREUM', content: ethAddr! } },
      {
        config: config.chain,
      },
    );
    const address = helpers.encodeToAddress(omniLockScript, { config: config.chain });

    return {
      address,
      chain: config.chain,
    };
  }

  public async signTransaction(tx: helpers.TransactionSkeletonType): Promise<Transaction> {
    const provider = this.getProvider();
    const config = getConfig();
    const inputs = tx.get('inputs');

    tx = tx.update('cellDeps', (cellDeps) =>
      cellDeps.push(getScriptCellDep('OMNILOCK'), getScriptCellDep('SECP256K1_BLAKE160')),
    );

    const witness = bytes.hexify(blockchain.WitnessArgs.pack({ lock: SECP_SIGNATURE_PLACEHOLDER }));
    inputs.forEach(() => {
      tx = tx.update('witnesses', (witnesses) => witnesses.push(witness));
    });

    tx = commons.omnilock.prepareSigningEntries(tx, { config: config.chain });
    const { message } = tx.signingEntries.get(0)!;

    let signature: string = await provider!.request({
      method: 'personal_sign',
      params: [message as Hex, provider!.selectedAddress],
    });
    // Fix ECDSA recoveryId v parameter
    // https://bitcoin.stackexchange.com/questions/38351/ecdsa-v-r-s-what-is-v
    let v = Number.parseInt(signature.slice(-2), 16);
    if (v >= 27) v -= 27;
    signature = '0x' + signature.slice(2, -2) + v.toString(16).padStart(2, '0');

    const signedWitness = bytes.hexify(
      blockchain.WitnessArgs.pack({
        lock: commons.omnilock.OmnilockWitnessLock.pack({
          signature: bytes.bytify(signature!).buffer,
        }),
      }),
    );

    tx = tx.update('witnesses', (witnesses) => witnesses.set(0, signedWitness));
    const signedTx = helpers.createTransactionFromSkeleton(tx);
    return signedTx;
  }

  public async disconnect(): Promise<void> {
    return;
  }
}
