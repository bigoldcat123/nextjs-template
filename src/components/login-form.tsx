"use client";
import { authenticate } from "@/features/user/user-action";
import { useActionState } from "react";

export default function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, action, isPending] = useActionState(authenticate, {
    error: "",
    callbackUrl,
  });
  return (
    <>
      <form action={action}>
        <label htmlFor="username">
          username: <input id="username" name="username"></input>
        </label>
        <label htmlFor="password">
          username: <input id="password" name="password"></input>
        </label>
        {state?.error && <div>{state.error}</div>}
        <button disabled={isPending} type="submit">
          login
        </button>
      </form>
    </>
  );
}
