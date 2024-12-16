import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { Conversation, Message } from '~models';
import { conversationRepository } from '~repositories';
import { formatDate } from '~libs/date';
import { cn } from '~libs/utils';
import Send from '~assets/svg/send.svg?react';
import { Input } from '~components/ui/input';
import { useSocket } from '~hooks/use-socket';
import { useChatLoaded } from '~hooks/use-chat-loaded';
import Chat from '~components/Chat';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const conversation = await conversationRepository.retrieveWithDiscussions(params.id!);
  return Response.json({ conversation });
};

export default function ChatPage() {
  const { conversation }: { conversation: Conversation } = useLoaderData<typeof loader>();

  // states, refs
  const [messages, setMessages] = useState<Partial<Message>[]>(conversation.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // lib hooks
  const socket = useSocket(`/chat/${conversation.id}`, {
    onMessage: (data: Partial<Message>) => {
      setMessages((prevMessages) => [...prevMessages.slice(0, -1), { ...data, id: undefined }]);
    },
  });

  const { show, handleNavigate } = useChatLoaded();

  // calculated values

  // effects
  useEffect(() => {
    setMessages(conversation.messages);
  }, [conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, messagesEndRef]);

  // handlers
  const handleSubmit = (value: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: value, createdAt: formatDate(new Date()) },
        { id: 'temp', role: 'assistant', content: undefined, createdAt: formatDate(new Date()) },
      ]);
      socket.send(value);
    }
  };

  return (
    <div
      className={cn(
        `overflow-y-auto flex flex-col justify-between h-full transition-[opacity,transform] duration-300 ease-in-out`,
        show ? 'opacity-100' : 'opacity-0',
        show ? 'translate-x-0' : '-translate-x-[100px]'
      )}
      onTransitionEnd={handleNavigate}
    >
      <div className="text-center text-2xl font-bold">{conversation.title}</div>
      <div className="flex-1 flex flex-col py-5 pr-4 gap-2 overflow-y-auto text-sm scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-100">
        {messages.map((message, i) => (
          <Chat
            key={`${message.id}-${message.createdAt}-${i}`}
            message={message}
            animate={!message.id && message.role === 'assistant'}
          />
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <Input placeholder="메세지를 입력하세요" onSubmit={handleSubmit}>
        <Send />
      </Input>
    </div>
  );
}
