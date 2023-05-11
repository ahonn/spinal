import React from 'react';
import { useConnect, useDisconnect, NexusConnentor } from '@spinal/react';

function App() {
  const { address, connected, connect } = useConnect({
    connector: new NexusConnentor(),
  });
  const { disconnect } = useDisconnect();

  return (
    <div className="App">
      {connected ? (
        <div>
          <div>address: {address}</div>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      ) : (
       <button onClick={() => connect()}>Connect</button>
      )}
    </div>
  );
}

export default App;
