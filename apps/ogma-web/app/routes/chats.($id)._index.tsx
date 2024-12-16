import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Conversation, Message } from '~models';
import { conversationRepository } from '~repositories';
import { formatDate } from '~libs/date';
import { cn } from '~libs/utils';
import { Avatar, AvatarFallback, AvatarImage } from '~components/ui/avatar';
import Send from '~assets/svg/send.svg?react';
import { Input } from '~components/ui/input';
import { useSocket } from '~hooks/use-socket';
import { useChatLoaded } from '~hooks/use-chat-loaded';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const conversation = await conversationRepository.retrieveWithDiscussions(params.id!);
  return Response.json({ conversation });
};

export default function Chat() {
  const { conversation }: { conversation: Conversation } = useLoaderData<typeof loader>();

  // states, refs
  const [messages, setMessages] = useState<Partial<Message>[]>(conversation.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // lib hooks
  const socket = useSocket(`/chat/${conversation.id}`, {
    onMessage: (data: Partial<Message>) => {
      // TODO: id undefined로 처리하는 게 맞아?
      setMessages((prevMessages) => [...prevMessages.slice(0, -1), { ...data, id: undefined }]);
    },
  });

  const { show, handleNavigate } = useChatLoaded();

  // calculated values

  // effects
  useEffect(() => {
    setLoaded(true);
  }, []);

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

  // TODO: refactor key, TypeAnimation 처리 로직 리팩토링
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
                className={`py-2 px-3 rounded-md shadow-md bg-${message.role === 'user' ? 'white' : 'slate-400'} ${message.role === 'user' ? 'self-end' : 'self-start'} max-w-md`}
              >
                {message.content?.split('<br>').map((text, index, array) => (
                  <span key={index}>
                    {text}
                    {index < array.length - 1 && <br />}
                  </span>
                )) || <l-bouncy size="24" speed="1.25" color="rgb(71 85 105)"></l-bouncy>}
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
      <Input placeholder="메세지를 입력하세요" onSubmit={handleSubmit}>
        <Send />
      </Input>
    </div>
  );
}
