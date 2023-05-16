import { atomsWithMutation } from 'jotai-tanstack-query';
import { useAtom } from 'jotai';
import type { Connector } from '@spinal-ckb/core';
import { connect } from '@spinal-ckb/core';
import { useConfig } from 'src/context';
import { useCallback, useEffect, useMemo } from 'react';

interface UseConnectArgs {
  connector: Connector;
}

const [, connectMutationAtom] = atomsWithMutation(() => ({
  mutationKey: ['connect'],
  mutationFn: async ({ connector }: UseConnectArgs) => {
    const response = await connect({ connector });
    return response?.data.address;
  },
}));

export function useConnect({ connector }: UseConnectArgs) {
  const config = useConfig();
  const state = config?.getConnectState();
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
