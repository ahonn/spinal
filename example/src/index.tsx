import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  SpinalConfigProvider,
  chains as predefineChains,
  configureChains,
  publicProvider,
} from '@spinal-ckb/react';
import App from './App.tsx';

const { rpcClient, indexer } = configureChains(
  [predefineChains.testnet],
  [publicProvider()],
);

const config = {
  autoConnect: true,
  rpcClient,
  indexer,
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <SpinalConfigProvider config={config}>
      <App />
    </SpinalConfigProvider>
  </React.StrictMode>
);
