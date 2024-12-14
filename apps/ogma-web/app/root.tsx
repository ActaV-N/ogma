import { Await, Link, Links, Meta, Outlet, Scripts, useLoaderData } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import styles from './tailwind.css?url';
import { conversationRepository } from '~repositories';
import { Conversation } from '~models';
import { Suspense } from 'react';
import { formatDate } from '~libs/date';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const loader = async () => {
  const conversations = await conversationRepository.list();
  return Response.json({
    conversations: conversations.map((conversation) => ({
      ...conversation,
      createdAt: formatDate(conversation.createdAt),
    })),
  });
};

export default function App() {
  const { conversations }: { conversations: Conversation[] } = useLoaderData<typeof loader>();

  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-200">
        <div className="flex h-screen">
          <div className="w-4/12 min-w-[300px] max-w-[400px] p-4">
            <nav className="bg-background h-full rounded-md shadow-md flex flex-col overflow-y-auto">
              <Suspense fallback={<div>Loading...</div>}>
                <Await resolve={conversations}>
                  {conversations.length ? (
                    conversations.map((conversation) => (
                      <Link
                        key={conversation.id}
                        to={`/chats/${conversation.id}`}
                        className="transition-colors duration-200 ease-in-out p-3 border-b hover:bg-gray-200 flex flex-col gap-1"
                      >
                        <div className="text-stone-800 text-sm">{conversation.title}</div>
                        <div className="text-stone-500 text-xs flex items-center gap-0.5">
                          <img
                            src="/assets/svg/clock.svg"
                            alt="clock"
                            className="size-3 text-stone-500"
                          />
                          {conversation.createdAt}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <>No data</>
                  )}
                </Await>
              </Suspense>
            </nav>
          </div>
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
