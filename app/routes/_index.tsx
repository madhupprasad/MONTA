import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "MONTA - Home" },
    { name: "description", content: "Welcome to MONTA!" },
  ];
};

export default function Index() {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to M.O.N.T.A</h1>
      <p className="text-xl mb-8">Your personal Todo App</p>
      <div className="space-x-4">
        <Link
          to="/lockers"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Manage Notes
        </Link>
        {/* Add more navigation links as needed */}
      </div>
    </div>
  );
}
