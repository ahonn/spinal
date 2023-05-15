import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  SpinalConfigProvider,
  chains,
} from '@spinal-ckb/react';
import App from './App.tsx';

const config = {
  autoConnect: true,
  chains: [chains.testnet],
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
