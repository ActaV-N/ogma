import { useLoaderData } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { LoaderFunctionArgs } from '@remix-run/node';
import { Input } from '~components/ui/input';
import { cn } from '~libs/utils';
import Search from '~assets/svg/search.svg?react';
import { Conversation, SearchHistory } from '~models';
import { conversationRepository } from '~repositories';
import { useSocket } from '~hooks/use-socket';
import { formatDate } from '~libs/date';
import { useChatLoaded } from '~hooks/use-chat-loaded';
import { MarkdownWithCitations } from '~components';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const conversation = await conversationRepository.retrieveWithSearchHistories(params.id!);
  return Response.json({ conversation });
};

export default function AskPage() {
  const { conversation }: { conversation: Conversation } = useLoaderData<typeof loader>();

  // states, refs
  const [searchHistories, setSearchHistories] = useState<Partial<SearchHistory>[]>(
    conversation.searchHistories
  );
  const searchHistoriesEndRef = useRef<HTMLDivElement>(null);

  // lib hooks
  const { show, handleNavigate } = useChatLoaded();

  const socket = useSocket(`/search/${conversation.id}`, {
    onMessage: (data: Partial<SearchHistory>) => {
      setSearchHistories((prevMessages) => [...prevMessages.slice(0, -1), data]);
    },
  });

  // calculated values

  // effects
  useEffect(() => {
    searchHistoriesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [searchHistories, searchHistoriesEndRef]);

  // handlers
  const handleSearch = (value: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      setSearchHistories((prevMessages) => [...prevMessages, { question: value, id: undefined }]);
      socket.send(value);
    }
  };

  return (
    <div
      className={cn(
        'transition-[opacity,transform] duration-300 ease-in-out flex flex-col justify-start h-full gap-2 overflow-y-auto w-full',
        show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[100px]'
      )}
      onTransitionEnd={handleNavigate}
    >
      <Input placeholder="무엇이든 물어보세요" onSubmit={handleSearch}>
        <Search />
      </Input>
      <div className="flex flex-col gap-5 h-full overflow-y-auto">
        {searchHistories.map((searchHistory) => (
          <div
            key={`${searchHistory.id}-${searchHistory.question}-${formatDate(searchHistory.createdAt || '')}`}
            className={cn(
              'flex flex-col gap-5 border-b-[0.5px] border-gray-500 py-3',
              !searchHistory.answer?.choices.length ? 'animate-fade-in opacity-0' : 'opacity-100'
            )}
          >
            <h1 className="text-3xl">{searchHistory.question}</h1>
            <div>
              <h2 className="text-xl pb-2">Answer</h2>
              {searchHistory.answer?.choices.map((choice) => (
                <div key={`${searchHistory.id}-${choice.index}`}>
                  <MarkdownWithCitations
                    content={choice.message.content}
                    citations={searchHistory.answer?.citations}
                  />
                </div>
              )) || (
                <div className="flex">
                  <l-quantum size="32" speed="2" color="rgb(71 85 105)"></l-quantum>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={searchHistoriesEndRef} />
      </div>
    </div>
  );
}
