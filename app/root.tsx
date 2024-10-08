import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import "./tailwind.css";
import "./style.scss";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useState } from "react";
import { requireAuth } from "./utils/auth.server";

export async function loader({ request }: { request: Request }) {
  const CONVEX_URL = process.env["CONVEX_URL"]!;
  const url = new URL(request.url);
  if (url.pathname !== "/" && !url.pathname.startsWith("/logout")) {
    await requireAuth(request);
  }
  return json({ ENV: { CONVEX_URL } });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { ENV } = useLoaderData<typeof loader>();
  const [convex] = useState(() => new ConvexReactClient(ENV.CONVEX_URL));

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ConvexProvider client={convex}>{children}</ConvexProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
