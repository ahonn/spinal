import { atomsWithMutation } from 'jotai-tanstack-query';
import { useAtom } from 'jotai';
import type { Connector } from '@spinal-ckb/core';
import * as core from '@spinal-ckb/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { WithMutationArgs, defaultArgs } from './args';
import { useConfig } from 'src/context';

interface UseConnectArgs {
  connector: Connector;
}

export function useConnect(
  args: WithMutationArgs<UseConnectArgs, Awaited<ReturnType<typeof core.connect>> | undefined>,
) {
  const { connector, onSuccess, onError, onSettled } = args ?? defaultArgs;
  const config = useConfig();
  const connectMutationAtom = useMemo(() => {
    const [, atom] = atomsWithMutation(() => ({
      mutationKey: ['connect'],
      mutationFn: async ({ connector }: UseConnectArgs) => {
        const response = await core.connect({ connector });
        return response;
      },
      onSuccess,
      onError,
      onSettled,
    }));
    return atom;
  }, [onSuccess, onError, onSettled]);
  const [{ error, isError, isLoading, isSuccess }, mutate] = useAtom(connectMutationAtom);

  const [data, setData] = useState(config!.getConnectData(connector));
  const address = useMemo(() => data?.address, [data]);
  const connected = useMemo(() => !!address, [address]);

  useEffect(() => {
    config?.addConnector(connector);
    config?.onConnectDataChange(connector, setData);
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
