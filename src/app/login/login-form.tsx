"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "./actions";
import { AlertCircle, ArrowRight } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);

  React.useEffect(() => {
    if (state?.success) {
      router.push("/admin");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div
          role="alert"
          className="p-3 rounded border border-border bg-muted text-foreground text-xs flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-foreground" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-xs font-medium text-foreground"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="admin@proskillai.dev"
          disabled={isPending}
          className="w-full h-9 px-3 text-xs rounded border border-border bg-surface text-foreground focus:outline-2 focus:outline-foreground disabled:opacity-50"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-xs font-medium text-foreground"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          disabled={isPending}
          className="w-full h-9 px-3 text-xs rounded border border-border bg-surface text-foreground focus:outline-2 focus:outline-foreground disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-9 mt-2 inline-flex items-center justify-center gap-1.5 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-98 disabled:opacity-50 cursor-pointer"
      >
        <span>{isPending ? "Memverifikasi..." : "Masuk"}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}
