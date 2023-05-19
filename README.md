# Spinal CKB

> Wagmi-like React Hooks for Nervos CKB

Spinal is a collection of React Hooks containing everything you need to start working with Nervos CKB. Spinal makes it easy to "Connect Wallet" and balance information, send transaction, and much more — all with caching, request deduplication, and persistence.

## Installation
```
npm install @spinal-ckb/react --save
```

## Quick Start
```typescript
const config = {
  autoConnect: true,
  chains: [chains.testnet],
  connectors: [new MetaMaskConnector()], // NexusConnector / JoyIdConnector
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <SpinalConfigProvider config={config}>
    <App />
  </SpinalConfigProvider>
);
```

```
import { useConnect, useDisconnect, useCapacities } from '@spinal-ckb/react';
 
function Profile() {
  const { address, connect, connected } = useConnect();
  const { disconnect } = useDisconnect();
  const { capacities } = useCapacities();
 
  if (connected)
    return (
      <div>
        Connected to {address}
        Capacities: ${(capacities / (10 ** 8)).toFixed(2)} CKB
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
  return <button onClick={() => connect()}>Connect Wallet</button>;
}
```

## License

[MIT](/LICENSE) License
