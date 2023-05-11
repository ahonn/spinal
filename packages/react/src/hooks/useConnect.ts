import { atomsWithMutation } from 'jotai-tanstack-query';
import { useAtom } from 'jotai';
import type { ConnectState, Connector } from '@spinal/core';
import { connect } from '@spinal/core';
import { useConfig } from 'src/context';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface UseConnectArgs {
  connector: Connector;
}

const [, connectMutationAtom] = atomsWithMutation(() => ({
  mutationKey: ['connect'],
  mutationFn: async ({ connector }: UseConnectArgs) => {
    const {
      data: { address },
    } = await connect({ connector });
    return address;
  },
}));

export function useConnect({ connector }: UseConnectArgs) {
  const config = useConfig();
  const [state, setState] = useState(config?.getConnectState());
  const [{ error, isError, isLoading, isSuccess }, mutate] = useAtom(connectMutationAtom);

  const address = useMemo(() => state?.data?.address, [state]);
  const connected = useMemo(() => state?.status === 'connected', [state]);

  useEffect(() => {
    config?.onConnectChange((state: ConnectState) => {
      setState(state);
    });
  }, [config]);

  useEffect(() => {
    config?.addConnector(connector);
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
