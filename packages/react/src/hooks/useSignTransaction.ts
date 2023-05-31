import { atomsWithMutation } from 'jotai-tanstack-query';
import { helpers } from '@ckb-lumos/lumos';
import * as core from '@spinal-ckb/core';
import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { WithMutationArgs, defaultArgs } from './args';

export interface UseSendTransactionArgs {
  tx: helpers.TransactionSkeletonType;
}

export function useSendTransaction(args?: WithMutationArgs<UseSendTransactionArgs, string>) {
  const { tx, onSuccess, onError, onSettled } = args ?? defaultArgs;
  const sendTransactionMutationAtom = useMemo(() => {
    const [, atom] = atomsWithMutation(() => ({
      mutationKey: ['sendTransaction'],
      mutationFn: async ({ tx }: UseSendTransactionArgs) => {
        const txHash = await core.signTransaction(tx);
        return txHash;
      },
      onSuccess,
      onError,
      onSettled,
    }));
    return atom;
  }, [onSuccess, onError, onSettled]);

  const [{ data, error, isError, isLoading, isSuccess }, mutate] = useAtom(sendTransactionMutationAtom);

  const signTransaction = useCallback(async () => {
    await mutate([{ tx }]);
  }, [mutate, tx]);

  return {
    error,
    isError,
    isLoading,
    isSuccess,
    data,
    signTransaction,
  };
}
