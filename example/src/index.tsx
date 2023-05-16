import React from 'react';
import ReactDOM from 'react-dom/client';
import { SpinalConfigProvider, chains } from '@spinal-ckb/react';
import { ChakraProvider } from '@chakra-ui/react';
// @ts-ignore
import App from './App.tsx';

const config = {
  autoConnect: true,
  chains: [chains.testnet],
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <SpinalConfigProvider config={config}>
        <App />
      </SpinalConfigProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
