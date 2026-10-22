"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "./actions";
import { AlertCircle, ArrowRight, Shield, User } from "lucide-react";

const isDev = process.env.NODE_ENV !== "production";

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  React.useEffect(() => {
    if (state?.success) {
      router.push("/admin");
      router.refresh();
    }
  }, [state, router]);

  const fillAdmin = () => {
    setEmail("admin@proskillai.dev");
    setPassword("ProSkill2026!Admin");
  };

  const fillUser = () => {
    setEmail("user@proskillai.dev");
    setPassword("ProSkill2026!User");
  };

  return (
    <div className="space-y-4">
      {isDev && (
        <div className="p-3 rounded-[6px] border border-border bg-surface space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">
              Mode Pengembangan (Quick Fill)
            </span>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] bg-muted text-muted-foreground font-mono">
              Dev Only
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillAdmin}
              className="inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-[6px] border border-border bg-muted/60 hover:bg-muted text-foreground text-xs font-medium cursor-pointer transition-transform active:scale-95"
            >
              <Shield className="w-3.5 h-3.5 text-foreground shrink-0" />
              <span>Isi Admin</span>
            </button>
            <button
              type="button"
              onClick={fillUser}
              className="inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-[6px] border border-border bg-muted/60 hover:bg-muted text-foreground text-xs font-medium cursor-pointer transition-transform active:scale-95"
            >
              <User className="w-3.5 h-3.5 text-foreground shrink-0" />
              <span>Isi User</span>
            </button>
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-4">
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
          className="w-full h-9 mt-2 inline-flex items-center justify-center gap-1.5 rounded-[6px] text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          <span>{isPending ? "Memverifikasi..." : "Masuk"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
