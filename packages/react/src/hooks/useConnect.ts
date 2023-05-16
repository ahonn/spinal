import { atomsWithMutation } from 'jotai-tanstack-query';
import { useAtom } from 'jotai';
import type { Connector } from '@spinal-ckb/core';
import * as core from '@spinal-ckb/core';
import { useConfig } from 'src/context';
import { useCallback, useEffect, useMemo } from 'react';
import { WithMutationArgs } from './type';

interface UseConnectArgs {
  connector: Connector;
}

export function useConnect(args: WithMutationArgs<UseConnectArgs, string | undefined>) {
  const { connector, onSuccess, onError, onSettled } = args;
  const config = useConfig();
  const state = config?.getConnectState();
  const connectMutationAtom = useMemo(() => {
    const [, atom] = atomsWithMutation(() => ({
      mutationKey: ['connect'],
      mutationFn: async ({ connector }: UseConnectArgs) => {
        const response = await core.connect({ connector });
        return response?.data.address;
      },
      onSuccess,
      onError,
      onSettled,
    }));
    return atom;
  }, [onSuccess, onError, onSettled]);
  const [{ error, isError, isLoading, isSuccess }, mutate] = useAtom(connectMutationAtom);

  const address = useMemo(() => state?.data?.address, [state]);
  const connected = useMemo(
    () => state?.status === 'connected' && state?.connector?.id === connector.id,
    [state, connector],
  );

  useEffect(() => {
    config?.setConnector(connector);
  }, [config, connector]);

  const connect = useCallback(() => {
    return mutate([{ connector }]);
  }, [connector, mutate]);

  return {
    error,
    isError,
    isLoading,
    isSuccess,
    address,
    connect,
    connected,
  };
}
