import { atomsWithMutation } from 'jotai-tanstack-query';
import { useAtom } from 'jotai';
import { disconnect } from '@spinal-ckb/core';
import { useCallback } from 'react';

const [, disconnectMutationAtom] = atomsWithMutation(() => ({
  mutationKey: ['disconnect'],
  mutationFn: async () => {
    return disconnect();
  },
}));

export function useDisconnect() {
  const [{ error, isError, isLoading, isSuccess }, mutate] = useAtom(disconnectMutationAtom);

  const disconnect = useCallback(async () => {
    await mutate([undefined]);
  }, [mutate]);

  return {
    error,
    isError,
    isLoading,
    isSuccess,
    disconnect,
  };
}
