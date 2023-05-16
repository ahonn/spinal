import { atomsWithMutation } from 'jotai-tanstack-query';
import { useAtom } from 'jotai';
import * as core from '@spinal-ckb/core';
import { useCallback, useMemo } from 'react';
import { WithMutationArgs } from './type';

export function useDisconnect(args: WithMutationArgs<void, void>) {
  const { onSuccess, onError, onSettled } = args;
  const disconnectMutationAtom = useMemo(() => {
    const [, atom] = atomsWithMutation(() => ({
      mutationKey: ['disconnect'],
      mutationFn: async () => {
        return core.disconnect();
      },
      onSuccess,
      onError,
      onSettled,
    }));
    return atom;
  }, [onSuccess, onError, onSettled]);
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
