import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useOutletContext } from '@remix-run/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Conversation, Message } from '~models';
import { conversationRepository } from '~repositories';
import { formatDate } from '~libs/date';
import { cn } from '~libs/utils';
import { Avatar, AvatarFallback, AvatarImage } from '~components/ui/avatar';
import Send from '~assets/svg/send.svg?react';
import { Input } from '~components/ui/input';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const conversation = await conversationRepository.retrieve(params.id!);
  return Response.json({ conversation });
};

export default function Chat() {
  const { conversation }: { conversation: Conversation } = useLoaderData<typeof loader>();
  const { shouldNavigate, handleNavigate } = useOutletContext<{
    shouldNavigate: boolean;
    handleNavigate: () => void;
  }>();

  // states, refs
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Partial<Message>[]>(conversation.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // calculated values
  const shouldShow = !shouldNavigate && loaded;

  // effects
  useEffect(() => {
    setLoaded(true);
  }, []);

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

  // handlers
  const handleSubmit = (value: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: value, createdAt: formatDate(new Date()) },
      ]);
      socket.send(value);
    }
  };

  return (
    <div
      className={cn(
        `overflow-y-auto flex flex-col justify-between h-full transition-[opacity,transform] duration-300 ease-in-out`,
        shouldShow ? 'opacity-100' : 'opacity-0',
        shouldShow ? 'translate-x-0' : '-translate-x-[100px]'
      )}
      onTransitionEnd={handleNavigate}
    >
      <div className="text-center text-2xl font-bold">{conversation.title}</div>
      <div className="flex-1 flex flex-col py-5 pr-4 gap-2 overflow-y-auto text-sm scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-100">
        {messages.map((message, i) =>
          message.id || message.role === 'user' ? (
            <div className="flex flex-col gap-2" key={`${message.id}-${message.createdAt}-${i}`}>
              <Avatar className={`size-8 ${message.role === 'user' ? 'self-end' : 'self-start'}`}>
                <AvatarImage
                  src={message.role === 'assistant' ? '/assets/images/socrates.png' : ''}
                />
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
              <div
                className={`p-2 rounded-md shadow-md bg-${message.role === 'user' ? 'white' : 'slate-400'} ${message.role === 'user' ? 'self-end' : 'self-start'} max-w-md`}
              >
                {message.content?.split('<br>').map((text, index, array) => (
                  <span key={index}>
                    {text}
                    {index < array.length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Avatar className={`size-8 self-start`}>
                <AvatarImage
                  src={message.role === 'assistant' ? '/assets/images/socrates.png' : ''}
                />
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
              <TypeAnimation
                key={`${message.id}-${message.createdAt}-${i}`}
                sequence={[message.content?.replace(/<br>/g, '\n') || '']}
                speed={50}
                cursor={false}
                className={`p-2 rounded-md shadow-md bg-slate-400 self-start max-w-md`}
              />
            </div>
          )
        )}
        <div ref={messagesEndRef}></div>
      </div>
      <Input onSubmit={handleSubmit}>
        <Send />
      </Input>
    </div>
  );
}
