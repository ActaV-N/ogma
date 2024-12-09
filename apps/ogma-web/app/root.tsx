import { Links, Meta, Outlet, Scripts } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import styles from './tailwind.css?url';
export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export default function App() {
  return (
    <html>
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gradient-45 from-background-gradient-from via-background-gradient-via to-background-gradient-to bg-gradient-animate animate-gradient-shift-slow">
        <div className="flex h-screen">
          <div className="w-4/12 min-w-[300px] max-w-[400px] p-4">
            <nav className="bg-background h-full rounded-md  shadow-md">
              {/* TODO: conversation list */}
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
