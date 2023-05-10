import React from 'react';
import { useConnect, NexusConnentor } from '@spinal/react';

function App() {
  const { address, connected, connect } = useConnect({
    connector: new NexusConnentor(),
  });

  return (
    <div className="App">
      {connected ? (
        <span>address: {address}</span>
      ) : (
       <button onClick={() => connect()}>Connect</button>
      )}
    </div>
  );
}

export default App;
