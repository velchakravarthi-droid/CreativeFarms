"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="login-form">
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" placeholder="admin@creativefarm.com" required />
      </label>
      <label className="field">
        <span>Password</span>
        <input name="password" type="password" autoComplete="current-password" placeholder="Password" required />
      </label>
      {state.error ? <div className="form-error">{state.error}</div> : null}
      <button className="button" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
