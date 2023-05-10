import { atomWithStorage } from 'jotai/utils';
import type { ConnecterData, Connector } from 'src/connectors/base';

export type ConnectStatus = 'connecting' | 'connected' | 'disconnect';

export const connectAtom = atomWithStorage<{
  data: ConnecterData | undefined;
  connector: Connector | undefined;
  status: ConnectStatus;
}>('connect', {
  data: undefined,
  connector: undefined,
  status: 'disconnect',
});
