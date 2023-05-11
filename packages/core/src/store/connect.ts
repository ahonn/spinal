import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { ConnecterData, Connector } from 'src/connectors/base';

export type ConnectStatus = 'connecting' | 'connected' | 'disconnect';

export interface ConnectState {
  data: ConnecterData | undefined;
  connector: Connector | undefined;
  status: ConnectStatus;
}

const DEFAULT_CONNECT_PAYLOAD = {
  data: undefined,
  connector: undefined,
};

const connectPayloadAtom = atomWithStorage<Pick<ConnectState, 'data' | 'connector'>>(
  'connect',
  DEFAULT_CONNECT_PAYLOAD,
);

const connectStatusAtom = atom<ConnectStatus>('disconnect');

export const connectAtom = atom(
  (get) => {
    const { data, connector } = get(connectPayloadAtom);
    const status = get(connectStatusAtom);
    return {
      data,
      connector,
      status,
    };
  },
  (_, set, update: Partial<ConnectState> | undefined) => {
    if (update === undefined) {
      set(connectPayloadAtom, DEFAULT_CONNECT_PAYLOAD);
      set(connectStatusAtom, 'disconnect');
      return;
    }

    if (update.data !== undefined && update.connector !== undefined) {
      set(connectPayloadAtom, {
        data: update.data,
        connector: update.connector,
      });
    }
    if (update.status !== undefined) {
      set(connectStatusAtom, update.status);
    }
  },
);
