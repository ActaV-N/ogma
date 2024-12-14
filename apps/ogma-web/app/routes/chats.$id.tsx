import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { Conversation, Message } from '~models';
import { conversationRepository } from '~repositories';
import { formatDate } from '~libs/date';
import { TypeAnimation } from 'react-type-animation';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const conversation = await conversationRepository.retrieve(params.id!);
  return Response.json({ conversation });
};

export default function Chat() {
  const { conversation }: { conversation: Conversation } = useLoaderData<typeof loader>();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Partial<Message>[]>(conversation.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(conversation.messages);
  }, [conversation]);

  useEffect(() => {
    if (socket) {
      socket.close();
    }

    const ws = new WebSocket(`ws://localhost:3000/api/chat/${conversation.id}`);
    ws.onopen = () => {
      console.log('Connected to websocket server');
    };

    ws.onmessage = (event) => {
      console.log('Received message from server:', event.data);
      const data = JSON.parse(event.data).data;
      setMessages((prevMessages) => [...prevMessages, { ...data, id: undefined }]);
    };

    ws.onclose = () => {
      console.log('Disconnected from websocket server');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [conversation.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, messagesEndRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket?.readyState === WebSocket.OPEN) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: message, createdAt: formatDate(new Date()) },
      ]);
      socket.send(message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col justify-between gap-2 h-full">
      <div className="text-center text-2xl font-bold">{conversation.title}</div>
      <div className="flex-1 flex flex-col p-5 gap-2 overflow-y-auto">
        {messages.map((message, i) =>
          message.id || message.role === 'user' ? (
            <div
              key={`${message.id}-${message.createdAt}-${i}`}
              className={`p-2 rounded-md shadow-md bg-${message.role === 'user' ? 'white' : 'slate-400'} ${message.role === 'user' ? 'self-start' : 'self-end'}`}
            >
              {message.content}
            </div>
          ) : (
            <TypeAnimation
              key={`${message.id}-${message.createdAt}-${i}`}
              sequence={[message.content || '']}
              speed={50}
              cursor={false}
              className={`p-2 rounded-md shadow-md bg-slate-400 self-end`}
            />
          )
        )}
        <div ref={messagesEndRef}></div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex w-full bg-white rounded-full py-2 pl-4 pr-2 gap-1"
      >
        <input
          className="outline-none bg-none flex-1"
          type="text"
          name="message"
          placeholder="메세지를 입력하세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="p-[7px] size-8 bg-slate-400 rounded-full">
          <img className="w-full h-full" src="/assets/svg/send.svg" alt="send" />
        </button>
      </form>
    </div>
  );
}
