import { useEffect, useState } from 'react';

export function useSocket<T = any>(path: string, options: { onMessage?: (data: T) => void }) {
  const { onMessage } = options;
  const [socket, setSocket] = useState<WebSocket | null>(null);

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

      onMessage?.(data);
    };

    ws.onclose = () => {
      console.log('Disconnected from websocket server');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [path]);

  return socket;
}
