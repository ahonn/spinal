import { createContext, useContext } from 'react';
import type { PropsWithChildren } from 'react';
import type { CreateConfigParameters } from '@spinal/core';

export const SpinalConfigContext = createContext<
  CreateConfigParameters | undefined
>(undefined);

export interface SpinalConfigProviderProps extends PropsWithChildren {
  config: CreateConfigParameters;
}

export function SpinalConfigProvider(props: SpinalConfigProviderProps) {
  const { children, config } = props;
  return (
    <SpinalConfigContext.Provider value={config}>
      {children}
    </SpinalConfigContext.Provider>
  );
}

export function useConfig() {
  const config = useContext(SpinalConfigContext);
  return config;
}
