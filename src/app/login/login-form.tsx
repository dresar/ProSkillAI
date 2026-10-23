"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "./actions";
import { AlertCircle, ArrowRight, Zap, ShieldCheck, User as UserIcon, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [quickLoadingRole, setQuickLoadingRole] = React.useState<string | null>(null);

  const formRef = React.useRef<HTMLFormElement>(null);
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (state?.success) {
      const search = new URLSearchParams(window.location.search);
      const target = search.get("redirect");
      const isSafeTarget =
        typeof target === "string" && target.startsWith("/") && !target.startsWith("//");
      const isAdminOrEditor = state.role === "admin" || state.role === "editor";

      if (isSafeTarget) {
        if (!isAdminOrEditor && target.startsWith("/admin")) {
          router.push("/id");
        } else {
          router.push(target);
        }
      } else {
        router.push(isAdminOrEditor ? "/admin" : "/id");
      }
      router.refresh();
    } else if (state?.error) {
      setQuickLoadingRole(null);
    }
  }, [state, router]);

  const handleQuickLogin = (targetRole: "admin" | "user", quickEmail: string, quickPass: string) => {
    setQuickLoadingRole(targetRole);
    setEmail(quickEmail);
    setPassword(quickPass);
    if (emailInputRef.current) emailInputRef.current.value = quickEmail;
    if (passwordInputRef.current) passwordInputRef.current.value = quickPass;

    setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 20);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-5"
    >
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
          className="w-full h-9 mt-1 inline-flex items-center justify-center gap-1.5 rounded-[6px] text-xs font-semibold bg-foreground text-background hover:opacity-90 transition-transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <span>Masuk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-border/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-foreground tracking-tight flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Login Cepat Dev (1-Klik)</span>
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/60">
            Dev Mode
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isPending}
            onClick={() => handleQuickLogin("admin", "admin@proskillai.dev", "ProSkill2026!Admin")}
            className="flex flex-col items-start p-2.5 rounded-[8px] border border-border bg-background hover:bg-muted/60 transition-all cursor-pointer group text-left space-y-1 disabled:opacity-50"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-mono">
                Admin
              </span>
              {quickLoadingRole === "admin" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
            </div>
            <span className="text-xs font-semibold text-foreground truncate block w-full">
              Administrator
            </span>
            <span className="text-[10px] text-muted-foreground font-mono truncate block w-full">
              admin@proskillai.dev
            </span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isPending}
            onClick={() => handleQuickLogin("user", "user@proskillai.dev", "ProSkill2026!User")}
            className="flex flex-col items-start p-2.5 rounded-[8px] border border-border bg-background hover:bg-muted/60 transition-all cursor-pointer group text-left space-y-1 disabled:opacity-50"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-mono">
                Member
              </span>
              {quickLoadingRole === "user" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
              ) : (
                <UserIcon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
            </div>
            <span className="text-xs font-semibold text-foreground truncate block w-full">
              Demo User
            </span>
            <span className="text-[10px] text-muted-foreground font-mono truncate block w-full">
              user@proskillai.dev
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
