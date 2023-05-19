import { MetaMaskConnector, NexusConnector, JoyIdConnector } from '@spinal-ckb/react';

export const CONNECTORS = [
  {
    name: 'MetaMask',
    colorScheme: 'orange',
    connector: new MetaMaskConnector(),
  },
  {
    name: 'Nexus',
    colorScheme: 'purple',
    connector: new NexusConnector(),
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
