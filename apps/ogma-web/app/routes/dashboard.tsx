import { type LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

// You'll need to implement proper authentication later
interface LoaderData {
  user: {
    name: string;
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  // This is where you'll add authentication check
  // For now, returning mock data
  return {
    user: {
      name: "User",
    },
  };
};

export default function Dashboard() {
  const { user } = useLoaderData<LoaderData>();

  return (
    <div>
      <header>
        <h1>Welcome back, {user.name}</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
} 