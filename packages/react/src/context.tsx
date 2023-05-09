import { createContext, useContext } from 'react';
import type { PropsWithChildren } from 'react';
import { CreateConfigParameters, createConfig } from '@spinal/core';
import { Config } from '@spinal/core';

export const SpinalConfigContext = createContext<
  Config | undefined
>(undefined);

export interface SpinalConfigProviderProps extends PropsWithChildren {
  config: CreateConfigParameters;
}

export function SpinalConfigProvider(props: SpinalConfigProviderProps) {
  const { children, config } = props;
  return (
    <SpinalConfigContext.Provider value={createConfig(config)}>
      {children}
    </SpinalConfigContext.Provider>
  );
}

export function useConfig() {
  const config = useContext(SpinalConfigContext);
  return config;
}
