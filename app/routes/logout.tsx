import { ActionFunction, redirect } from "@remix-run/node";
import { sessionLogout } from "~/fb.sessions.server";

export const action: ActionFunction = async ({ request }) => {
  // logout
  if (request.url.includes("/logout")) {
    await sessionLogout(request);
    return redirect("/");
  }
};
