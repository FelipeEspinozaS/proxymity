import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { APP_NAME, type ITestMessage } from '@proxymity/shared';

// Conectamos al puerto 3001 donde está el server
const socket = io('http://localhost:3001');

function App() {
  const [message, setMessage] = useState<string>('Esperando...');

  useEffect(() => {
    socket.on('hello', (data: ITestMessage) => {
      setMessage(`${data.from} dice: ${data.text}`);
    });

    return () => { socket.off('hello'); };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>{APP_NAME}</h1>
      <h2>Estado: {message}</h2>
    </div>
  );
}

export default App;