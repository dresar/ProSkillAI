"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "./actions";
import { AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

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
    }
  }, [state, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-4"
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
          className="w-full h-9 mt-2 inline-flex items-center justify-center gap-1.5 rounded-[6px] text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>{isPending ? "Memverifikasi..." : "Masuk"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
    </motion.div>
  );
}
