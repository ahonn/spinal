import { atomsWithMutation } from 'jotai-tanstack-query';
import * as core from '@spinal-ckb/core';
import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { WithMutationArgs, defaultArgs } from './args';
import type { Transaction } from '@ckb-lumos/base';
import type { TransactionSkeletonType } from '@ckb-lumos/helpers';

export interface UseSignTransactionArgs {
  tx: TransactionSkeletonType;
}

export function useSignTransaction(args?: WithMutationArgs<UseSignTransactionArgs, string>) {
  const { tx, onSuccess, onError, onSettled } = args ?? defaultArgs;
  const signTransactionMutationAtom = useMemo(() => {
    const [, atom] = atomsWithMutation(() => ({
      mutationKey: ['signTransaction'],
      mutationFn: async ({ tx }: UseSignTransactionArgs) => {
        const txHash = await core.signTransaction(tx);
        return txHash;
      },
      onSuccess,
      onError,
      onSettled,
    }));
    return atom;
  }, [onSuccess, onError, onSettled]);

  const [{ data, error, isError, isLoading, isSuccess }, mutate] = useAtom(signTransactionMutationAtom);

  const signTransaction = useCallback(async () => {
    await mutate([{ tx }]);
  }, [mutate, tx]);

  return {
    error,
    isError,
    isLoading,
    isSuccess,
    data: data as Transaction,
    signTransaction,
  };
}
