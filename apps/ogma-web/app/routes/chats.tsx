import { Outlet } from '@remix-run/react';

export default function Chats() {
  return (
    <div className="h-screen py-4 pr-2">
      <Outlet />
    </div>
  );
}
