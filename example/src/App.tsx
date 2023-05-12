import React from 'react';
import { useConnect, useDisconnect, MetamaskConnector, useCapacities } from '@spinal-ckb/react';

function App() {
  const { address, connected, connect } = useConnect({
    connector: new MetamaskConnector(),
  });
  const { disconnect } = useDisconnect();
  const { balance } = useCapacities();

  return (
    <div className="App">
      {connected ? (
        <div>
          <div>address: {address}</div>
          <div>balance: {balance ?? 0} CKB</div>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      ) : (
        <button onClick={() => connect()}>Connect</button>
      )}
    </div>
  );
}

export default App;
