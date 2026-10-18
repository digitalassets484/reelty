"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { Logo } from "@/components/Logo";
import { loginAction, signupAction, type AuthState } from "@/app/actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
      {pending ? "One sec…" : label}
    </button>
  );
}

export function AuthScreen({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const [state, action] = useFormState<AuthState, FormData>(
    isSignup ? signupAction : loginAction,
    {},
  );

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Logo />
          <h1 className="mt-10 text-3xl font-extrabold tracking-tight text-ink">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-ink/55">
            {isSignup ? "Start posting like you have a marketing team." : "Log in to your content dashboard."}
          </p>

          <form action={action} className="mt-8 space-y-4">
            {isSignup && (
              <div>
                <label className="label">Full name</label>
                <input name="name" className="input" placeholder="Peter Eki" autoComplete="name" />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input name="email" className="input" type="email" placeholder="you@email.com" autoComplete="email" required />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                name="password"
                className="input"
                type="password"
                placeholder="••••••••"
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
              />
            </div>
            {state?.error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{state.error}</p>
            )}
            <SubmitButton label={isSignup ? "Create account" : "Log in"} />
          </form>

          <p className="mt-6 text-center text-sm text-ink/55">
            {isSignup ? (
              <>Already have an account? <Link href="/login" className="font-semibold text-brand">Log in</Link></>
            ) : (
              <>New here? <Link href="/signup" className="font-semibold text-brand">Create an account</Link></>
            )}
          </p>
        </div>
      </div>

      <div className="relative hidden items-center justify-center overflow-hidden bg-ink p-12 text-white grid-bg lg:flex">
        <div className="pointer-events-none absolute -top-20 right-0 h-96 w-96 rounded-full bg-brand/30 blur-3xl" />
        <div className="relative max-w-md">
          <div className="chip bg-white/10 text-white">Listing in. Post out.</div>
          <blockquote className="mt-6 text-2xl font-bold leading-snug">
            “Drop in an address. Get a finished, scheduled video of yourself before your coffee’s cold.”
          </blockquote>
          <p className="mt-6 text-sm text-white/60">
            Reelty writes the script, films your avatar, designs the post, and schedules everything —
            all behind one dashboard.
          </p>
        </div>
      </div>
    </main>
  );
}
