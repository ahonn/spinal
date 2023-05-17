import { atom } from 'jotai';
import { atomFamily, atomWithStorage } from 'jotai/utils';
import type { ConnecterData, Connector } from 'src/connectors/base';

export const connectAtom = atomFamily((id) => atomWithStorage<ConnecterData | undefined>(`connect@${id}`, undefined));

export const connectorAtom = atom<Connector | undefined>(undefined);
