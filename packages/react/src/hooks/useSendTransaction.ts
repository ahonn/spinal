import { atomsWithMutation } from 'jotai-tanstack-query';
import { sendTransaction } from '@spinal-ckb/core';
import { useAtom } from 'jotai';
import { useCallback } from 'react';

export interface UseSendTransactionArgs {
  to: string;
  amount: string;
}

const [, sendTransactionMutationAtom] = atomsWithMutation(() => ({
  mutationKey: ['sendTransaction'],
  mutationFn: async ({ to, amount }: UseSendTransactionArgs) => {
    const txHash = await sendTransaction(to, amount);
    return txHash;
  },
}));

export function useSendTransaction({ to, amount }: UseSendTransactionArgs) {
  const [{ data: txHash, error, isError, isLoading, isSuccess }, mutate] = useAtom(sendTransactionMutationAtom);

  const sendTransaction = useCallback(async () => {
    await mutate([{ to, amount }]);
  }, [to, amount, mutate]);

  return {
    error,
    isError,
    isLoading,
    isSuccess,
    txHash,
    sendTransaction,
  };
}
