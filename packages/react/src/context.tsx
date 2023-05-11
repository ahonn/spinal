import { createContext, useContext } from 'react';
import type { PropsWithChildren } from 'react';
import type { Config, CreateConfigParameters } from '@spinal-ckb/core';
import { Provider as JotaiProvider } from 'jotai';
import { createConfig } from '@spinal-ckb/core';

export const SpinalConfigContext = createContext<Config | undefined>(undefined);

export interface SpinalConfigProviderProps extends PropsWithChildren {
  config: CreateConfigParameters;
}

export function SpinalConfigProvider(props: SpinalConfigProviderProps) {
  const { children, config } = props;
  return (
    <JotaiProvider>
      <SpinalConfigContext.Provider value={createConfig(config)}>
        {children}
      </SpinalConfigContext.Provider>
    </JotaiProvider>
  );
}

export function useConfig() {
  const config = useContext(SpinalConfigContext);
  return config;
}
