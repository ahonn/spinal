import { BI } from '@ckb-lumos/lumos';
import { getCapacities } from '@spinal-ckb/core';
import { useAtom } from 'jotai';
import { atomsWithMutation } from 'jotai-tanstack-query';
import { useEffect, useMemo } from 'react';
import { useConfig } from 'src/context';

export const getBalanceByCapacity = (capacity: BI): string => {
  return (Math.floor(BI.from(capacity).toNumber() / 10 ** 6) / 100).toFixed(2);
};

const [, capacitiesMutationAtom] = atomsWithMutation(() => ({
  mutationKey: ['capacities'],
  mutationFn: async () => {
    const capacities = await getCapacities();
    return capacities;
  },
}));

export function useCapacities() {
  const config = useConfig();
  const [{ data: capacities, error, isError, isLoading, isSuccess }, mutate] = useAtom(capacitiesMutationAtom);
  const balance = useMemo(() => (capacities ? getBalanceByCapacity(capacities) : '0'), [capacities]);

  useEffect(() => {
    config?.onConnectChange(() => {
      mutate([undefined]);
    });
  }, [config, mutate]);

  return {
    capacities,
    balance,
    error,
    isError,
    isLoading,
    isSuccess,
  };
}
