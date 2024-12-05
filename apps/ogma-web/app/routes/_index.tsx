import { type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Ogma - Welcome" },
    { name: "description", content: "Welcome to Ogma" },
  ];
};

export default function Index() {
  return (
    <div className="container">
      <main>
        Working on it...
      </main>
    </div>
  );
}
