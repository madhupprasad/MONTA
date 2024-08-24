import type { MetaFunction } from "@remix-run/node";
import { useActionData, useFetcher } from "@remix-run/react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useRef } from "react";
import { sessionLogin } from "~/fb.sessions.server";
import { auth } from "~/firebase.client";

export const meta: MetaFunction = () => {
  return [
    { title: "MONTA - Home" },
    { name: "description", content: "Welcome to MONTA!" },
  ];
};

export const action = async ({ request }) => {
  const formData = await request.formData();

  try {
    return await sessionLogin(request, formData.get("idToken"), "/lockers");
  } catch (error) {
    console.log("error", error);
    return { error: { message: error?.message } };
  }
};

export default function Index() {
  const fetcher = useFetcher();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const actionData = useActionData();

  console.log("actionData", actionData);

  const signInWithEmail = async () => {
    try {
      await signOut(auth);
      const authResp = await signInWithEmailAndPassword(
        auth,
        emailRef?.current?.value,
        passwordRef?.current?.value
      );
      console.log("authResp", authResp);

      // if signin was successful then we have a user
      if (authResp.user) {
        const idToken = await auth.currentUser.getIdToken();
        fetcher.submit(
          { idToken: idToken, "email-login": true },
          { method: "post" }
        );
      }
    } catch (err) {
      console.log("signInWithEmail", err);
    }
  };
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to M.O.N.T.A</h1>
      <p className="text-xl mb-8">Your personal Todo App</p>

      <input type="email" ref={emailRef} className="w-[200px] mb-2" />
      <input type="password" ref={passwordRef} className="w-[200px]" />
      <button name="email-login" onClick={signInWithEmail} type="button">
        Sign In
      </button>

      <div className="errors">
        {actionData?.error ? actionData?.error?.message : "-"}
      </div>
    </div>
  );
}
