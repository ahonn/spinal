import { MetaMaskConnector, JoyIdConnector } from '@spinal-ckb/react';

export const CONNECTORS = [
  {
    name: 'MetaMask',
    colorScheme: 'orange',
    connector: new MetaMaskConnector(),
  },
  {
    name: 'JoyID',
    colorScheme: 'green',
    connector: new JoyIdConnector(),
    features: {
      transfer: false,
    },
  },
];
