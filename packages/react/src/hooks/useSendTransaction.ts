import { atomsWithMutation } from 'jotai-tanstack-query';
import type { MutationOptions } from '@tanstack/query-core';
import * as core from '@spinal-ckb/core';
import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';

export interface UseSendTransactionArgs extends Pick<MutationOptions<string>, 'onSuccess' | 'onError'> {
  to: string;
  amount: string;
}

export function useSendTransaction(args: UseSendTransactionArgs) {
  const { to, amount, onSuccess, onError } = args;
  const sendTransactionMutationAtom = useMemo(() => {
    const [, sendTransactionMutationAtom] = atomsWithMutation(() => ({
      mutationKey: ['sendTransaction'],
      mutationFn: async ({ to, amount }: UseSendTransactionArgs) => {
        const txHash = await core.sendTransaction(to, amount);
        return txHash;
      },
      onSuccess,
      onError,
    }));
    return sendTransactionMutationAtom;
  }, [onSuccess, onError]);

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
