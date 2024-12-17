import {
  Await,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
  useLocation,
} from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import styles from './tailwind.css?url';
import { conversationRepository } from '~repositories';
import { Conversation } from '~models';
import { Suspense } from 'react';
import { formatDate } from '~libs/date';
import { Sidebar } from '~components/ui/sidebar';
import Clock from '~assets/svg/clock.svg?react';

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
  const location = useLocation();

  const isHome = location.pathname === '/';

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
          <Sidebar home={isHome}>
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
                        <Clock className="size-3 text-stone-500" />
                        {conversation.createdAt}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-full text-stone-500">
                    진행 중인 토론이 없어요🙂‍↔️
                  </div>
                )}
              </Await>
            </Suspense>
          </Sidebar>
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
