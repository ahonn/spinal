import { BI } from '@ckb-lumos/lumos';
import * as core from '@spinal-ckb/core';
import { useAtom } from 'jotai';
import { atomsWithMutation } from 'jotai-tanstack-query';
import { useEffect, useMemo } from 'react';
import { useConfig } from 'src/context';
import { WithMutationArgs, defaultArgs } from './args';

export const getBalanceByCapacity = (capacity: BI): string => {
  return (Math.floor(BI.from(capacity).toNumber() / 10 ** 6) / 100).toFixed(2);
};

export function useCapacities(args?: WithMutationArgs<void, BI>) {
  const { onSuccess, onError, onSettled } = args ?? defaultArgs;
  const config = useConfig();
  const capacitiesMutationAtom = useMemo(() => {
    const [, atom] = atomsWithMutation(() => ({
      mutationKey: ['capacities'],
      mutationFn: async () => {
        const capacities = await core.getCapacities();
        return capacities;
      },
      onSuccess,
      onError,
      onSettled,
    }));
    return atom;
  }, [onSuccess, onError, onSettled]);
  const [{ data: capacities, error, isError, isLoading, isSuccess }, mutate] = useAtom(capacitiesMutationAtom);
  const balance = useMemo(() => (capacities ? getBalanceByCapacity(capacities) : '0'), [capacities]);

  useEffect(() => {
    mutate([undefined]);
    config?.onConnectorChange(() => {
      mutate([undefined]);
    });
  }, [config, mutate]);

  return {
    data: capacities,
    capacities,
    balance,
    error,
    isError,
    isLoading,
    isSuccess,
  };
}
