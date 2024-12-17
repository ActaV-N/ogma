import { useEffect, useState } from 'react';

export function useSocket<T = any>(
  path: string,
  options: { onReceived?: (data: T) => void; onSent?: (data: string) => void }
) {
  const { onReceived, onSent } = options;
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.close();
    }

    const ws = new WebSocket(`ws://localhost:3000/api${path}`);
    ws.onopen = () => {
      console.log('Connected to websocket server');
    };

    ws.onmessage = (event) => {
      console.log('Received message from server:', event.data);
      const data = JSON.parse(event.data).data;

      onReceived?.(data);
      setLoading(false);
    };

    ws.onclose = () => {
      console.log('Disconnected from websocket server');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [path]);

  const sendMessage = (message: string, cb?: () => void) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      setLoading(true);
      socket.send(message);
      onSent?.(message);
    }
  };

  return { socket, loading, sendMessage };
}
