import { redirect } from "@remix-run/node";
import { isSessionValid } from "~/fb.sessions.server";

export async function requireAuth(request: Request) {
  try {
    await isSessionValid(request, "/");
  } catch (error) {
    throw redirect("/");
  }
}
