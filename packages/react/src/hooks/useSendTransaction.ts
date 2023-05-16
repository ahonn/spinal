import { atomsWithMutation } from 'jotai-tanstack-query';
import * as core from '@spinal-ckb/core';
import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { WithMutationArgs } from './type';

export interface UseSendTransactionArgs {
  to: string;
  amount: string;
}

export function useSendTransaction(args: WithMutationArgs<UseSendTransactionArgs, string>) {
  const { to, amount, onSuccess, onError, onSettled } = args;
  const sendTransactionMutationAtom = useMemo(() => {
    const [, atom] = atomsWithMutation(() => ({
      mutationKey: ['sendTransaction'],
      mutationFn: async ({ to, amount }: UseSendTransactionArgs) => {
        const txHash = await core.sendTransaction(to, amount);
        return txHash;
      },
      onSuccess,
      onError,
      onSettled,
    }));
    return atom;
  }, [onSuccess, onError, onSettled]);

  const [{ data, error, isError, isLoading, isSuccess }, mutate] = useAtom(sendTransactionMutationAtom);

  const sendTransaction = useCallback(async () => {
    await mutate([{ to, amount }]);
  }, [to, amount, mutate]);

  return {
    error,
    isError,
    isLoading,
    isSuccess,
    data,
    sendTransaction,
  };
}
