import { atomWithStorage } from 'jotai/utils';
import { Chain } from 'src/chains';

export const chainAtom = atomWithStorage<Chain | undefined>('chain', undefined);
