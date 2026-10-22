"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "./actions";
import { AlertCircle, ArrowRight, ShieldCheck, UserCheck, Terminal } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (state?.success) {
      router.push("/admin");
      router.refresh();
    }
  }, [state, router]);

  const handleQuickLogin = (email: string, pass: string) => {
    if (emailInputRef.current) {
      emailInputRef.current.value = email;
    }
    if (passwordInputRef.current) {
      passwordInputRef.current.value = pass;
    }
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <form ref={formRef} action={formAction} className="space-y-4">
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
            ref={emailInputRef}
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
            ref={passwordInputRef}
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

      <div className="pt-2 border-t border-border/60">
        <div className="p-3.5 rounded-xl border border-dashed border-border bg-muted/30 space-y-2.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
            <Terminal className="w-3.5 h-3.5 text-foreground/80 shrink-0" />
            <span>Mode Development — Akses Cepat</span>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleQuickLogin("admin@proskillai.dev", "ProSkill2026!Admin")}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-border bg-surface hover:bg-muted text-xs font-medium text-foreground transition-all active:scale-98 disabled:opacity-50 cursor-pointer text-left"
            >
              <div className="flex items-center gap-2 min-w-0">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate">Masuk Cepat sebagai Admin</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground shrink-0">admin@proskillai.dev</span>
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => handleQuickLogin("user@proskillai.dev", "ProSkill2026!User")}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-border bg-surface hover:bg-muted text-xs font-medium text-foreground transition-all active:scale-98 disabled:opacity-50 cursor-pointer text-left"
            >
              <div className="flex items-center gap-2 min-w-0">
                <UserCheck className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="truncate">Masuk Cepat sebagai User</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground shrink-0">user@proskillai.dev</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
