import React from 'react';
import {
  useConnect,
  useDisconnect,
  NexusConnector,
  MetamaskConnector,
  useCapacities,
  useSendTransaction,
} from '@spinal-ckb/react';

function App() {
  const [to, setTo] = React.useState('');
  const [amount, setAmount] = React.useState('');

  const { address, connected, connect } = useConnect({
    connector: new NexusConnector(),
    // connector: new MetamaskConnector(),
  });
  const { disconnect } = useDisconnect();
  const { balance } = useCapacities();
  const { sendTransaction } = useSendTransaction({ to, amount });

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
      {connected && (
        <div>
          <h2>Send Transaction</h2>
          to: <input value={to} onChange={(e) => setTo(e.target.value)} />
          amount(CKB): <input value={amount} onChange={(e) => setAmount(e.target.value)} />
          <button onClick={() => sendTransaction()}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;
