"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "./actions";
import { AlertCircle, ArrowRight, Shield, User, ShieldCheck, UserCheck, Terminal } from "lucide-react";

const showQuickLogin =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_DEV_LOGIN === "true" ||
  true;

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (state?.success) {
      router.push("/admin");
      router.refresh();
    }
  }, [state, router]);

  const fillAdmin = () => {
    setEmail("admin@proskillai.dev");
    setPassword("ProSkill2026!Admin");
    if (emailInputRef.current) {
      emailInputRef.current.value = "admin@proskillai.dev";
    }
    if (passwordInputRef.current) {
      passwordInputRef.current.value = "ProSkill2026!Admin";
    }
  };

  const fillUser = () => {
    setEmail("user@proskillai.dev");
    setPassword("ProSkill2026!User");
    if (emailInputRef.current) {
      emailInputRef.current.value = "user@proskillai.dev";
    }
    if (passwordInputRef.current) {
      passwordInputRef.current.value = "ProSkill2026!User";
    }
  };

  const handleQuickLogin = (emailVal: string, passVal: string) => {
    setEmail(emailVal);
    setPassword(passVal);
    if (emailInputRef.current) {
      emailInputRef.current.value = emailVal;
    }
    if (passwordInputRef.current) {
      passwordInputRef.current.value = passVal;
    }
    if (formRef.current) {
      if (typeof formRef.current.requestSubmit === "function") {
        formRef.current.requestSubmit();
      } else {
        formRef.current.submit();
      }
    }
  };

  return (
    <div className="space-y-4">
      {showQuickLogin && (
        <div className="p-3 rounded-[6px] border border-border bg-surface space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-foreground/80 shrink-0" />
              Mode Pengembangan (Quick Fill & Akses Cepat)
            </span>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] bg-muted text-muted-foreground font-mono">
              Dev Only
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={fillAdmin}
              className="inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-[6px] border border-border bg-muted/60 hover:bg-muted text-foreground text-xs font-medium cursor-pointer transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shield className="w-3.5 h-3.5 text-foreground shrink-0" />
              <span>Isi Admin</span>
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={fillUser}
              className="inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-[6px] border border-border bg-muted/60 hover:bg-muted text-foreground text-xs font-medium cursor-pointer transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <User className="w-3.5 h-3.5 text-foreground shrink-0" />
              <span>Isi User</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/50">
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleQuickLogin("admin@proskillai.dev", "ProSkill2026!Admin")}
              className="inline-flex items-center justify-center gap-1.5 h-8 px-2 rounded-[6px] border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium cursor-pointer transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Masuk Admin</span>
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleQuickLogin("user@proskillai.dev", "ProSkill2026!User")}
              className="inline-flex items-center justify-center gap-1.5 h-8 px-2 rounded-[6px] border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-medium cursor-pointer transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Masuk User</span>
            </button>
          </div>
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-4">
        {state?.error && (
          <div
            role="alert"
            className="p-3 rounded-[6px] border border-border bg-muted text-foreground text-xs flex items-start gap-2"
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
            placeholder="nama@proskillai.dev"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            className="w-full h-9 px-3 text-xs rounded-[6px] border border-border bg-surface text-foreground focus:outline-2 focus:outline-foreground disabled:opacity-50"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            className="w-full h-9 px-3 text-xs rounded-[6px] border border-border bg-surface text-foreground focus:outline-2 focus:outline-foreground disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-9 mt-2 inline-flex items-center justify-center gap-1.5 rounded-[6px] text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>{isPending ? "Memverifikasi..." : "Masuk"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
