"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import {
  User,
  Shield,
  KeyRound,
  Sparkles,
  Layers,
  FileCode,
  Star,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Mail,
  Zap,
} from "lucide-react";
import { updateProfileNameAction, updatePasswordAction } from "./actions";
import { formatIsoDate } from "@/lib/format";

interface ProfileClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    aiCredits: number;
    createdAt: Date | string;
  };
  stats: {
    skillsCount: number;
    promptsCount: number;
  };
  locale: string;
}

export function ProfileClient({ user, stats, locale }: ProfileClientProps) {
  const isEn = locale === "en";

  const [nameState, nameAction, isNamePending] = useActionState(
    updateProfileNameAction,
    null
  );

  const [passwordState, passwordAction, isPasswordPending] = useActionState(
    updatePasswordAction,
    null
  );

  const [currentName, setCurrentName] = React.useState(user.name);
  const passwordFormRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (nameState?.success && nameState.name) {
      setCurrentName(nameState.name);
    }
  }, [nameState]);

  React.useEffect(() => {
    if (passwordState?.success && passwordFormRef.current) {
      passwordFormRef.current.reset();
    }
  }, [passwordState]);

  const initials = currentName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  const joinDate = formatIsoDate(user.createdAt) || "-";

  return (
    <div className="space-y-5 max-w-4xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {isEn ? "Account Settings & Profile" : "Pengaturan Akun & Profil"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEn
              ? "Manage your personal profile, credentials, and access quotas."
              : "Kelola profil pribadi, kata sandi akun, dan pantau kuota akses Anda."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(user.role === "admin" || user.role === "editor") && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground text-xs font-medium transition-all active:scale-95 shadow-2xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isEn ? "Admin Panel" : "Panel Admin"}</span>
            </Link>
          )}
          <Link
            href={`/${locale}/favorites`}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground text-xs font-medium transition-all active:scale-95 shadow-2xs"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{isEn ? "Favorites" : "Favorit"}</span>
          </Link>
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-foreground text-background font-mono text-base font-bold flex items-center justify-center shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-bold text-foreground truncate">
                  {currentName}
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-[4px] bg-muted font-semibold text-foreground border border-border">
                  {user.role}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3 h-3 text-muted-foreground" />
                  <span className="font-mono">{user.email}</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span>{isEn ? `Member since ${joinDate}` : `Bergabung ${joinDate}`}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
            <div className="px-3 py-1.5 rounded-lg border border-border bg-muted/40 text-right space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                {isEn ? "AI Credits" : "Kredit Tanya AI"}
              </span>
              <div className="flex items-center gap-1.5 justify-end">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span className="text-xs font-mono font-bold text-foreground">
                  {user.aiCredits} / 5
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-surface shadow-2xs overflow-hidden">
          <div className="p-3.5 sm:p-4 border-b border-border/80 bg-muted/20 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-foreground" />
              <h2 className="text-xs sm:text-sm font-bold text-foreground tracking-tight">
                {isEn ? "Edit Profile & Username" : "Ubah Profil & Nama"}
              </h2>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">
              ID: #{user.id.slice(0, 8)}
            </span>
          </div>

          <form action={nameAction} className="p-4 sm:p-5 space-y-3.5">
            {nameState?.error && (
              <div
                role="alert"
                className="p-2.5 rounded-[6px] border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{nameState.error}</span>
              </div>
            )}

            {nameState?.success && (
              <div
                role="status"
                className="p-2.5 rounded-[6px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{nameState.message}</span>
              </div>
            )}

            <div className="space-y-1">
              <label
                htmlFor="profile-name"
                className="block text-xs font-medium text-foreground"
              >
                {isEn ? "Display Name / Username" : "Nama Tampilan / Username"}
              </label>
              <input
                id="profile-name"
                name="name"
                type="text"
                required
                defaultValue={currentName}
                placeholder={isEn ? "Enter your name" : "Masukkan nama Anda"}
                disabled={isNamePending}
                className="w-full h-8 px-2.5 text-xs rounded-[6px] border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-foreground transition-all disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="profile-email"
                className="block text-xs font-medium text-foreground"
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="profile-email"
                  type="email"
                  readOnly
                  disabled
                  value={user.email}
                  className="w-full h-8 px-2.5 text-xs rounded-[6px] border border-border/70 bg-muted/50 text-muted-foreground font-mono cursor-not-allowed select-all"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                  Verified
                </span>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={isNamePending}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] bg-foreground text-background text-xs font-medium hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isNamePending ? (isEn ? "Saving..." : "Menyimpan...") : (isEn ? "Save Profile" : "Simpan Profil")}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-xl border border-border bg-surface shadow-2xs overflow-hidden">
          <div className="p-3.5 sm:p-4 border-b border-border/80 bg-muted/20 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-foreground" />
              <h2 className="text-xs sm:text-sm font-bold text-foreground tracking-tight">
                {isEn ? "Change Password" : "Ganti Kata Sandi"}
              </h2>
            </div>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>

          <form
            ref={passwordFormRef}
            action={passwordAction}
            className="p-4 sm:p-5 space-y-3"
          >
            {passwordState?.error && (
              <div
                role="alert"
                className="p-2.5 rounded-[6px] border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordState.error}</span>
              </div>
            )}

            {passwordState?.success && (
              <div
                role="status"
                className="p-2.5 rounded-[6px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passwordState.message}</span>
              </div>
            )}

            <div className="space-y-1">
              <label
                htmlFor="currentPassword"
                className="block text-xs font-medium text-foreground"
              >
                {isEn ? "Current Password" : "Kata Sandi Saat Ini"}
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                autoComplete="current-password"
                disabled={isPasswordPending}
                className="w-full h-8 px-2.5 text-xs rounded-[6px] border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-foreground transition-all disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="newPassword"
                className="block text-xs font-medium text-foreground"
              >
                {isEn ? "New Password (min. 8 characters)" : "Kata Sandi Baru (min. 8 karakter)"}
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                disabled={isPasswordPending}
                className="w-full h-8 px-2.5 text-xs rounded-[6px] border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-foreground transition-all disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-medium text-foreground"
              >
                {isEn ? "Confirm New Password" : "Konfirmasi Kata Sandi Baru"}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                disabled={isPasswordPending}
                className="w-full h-8 px-2.5 text-xs rounded-[6px] border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-foreground transition-all disabled:opacity-50"
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={isPasswordPending}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] bg-foreground text-background text-xs font-medium hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>
                  {isPasswordPending
                    ? isEn
                      ? "Updating..."
                      : "Memperbarui..."
                    : isEn
                    ? "Update Password"
                    : "Perbarui Kata Sandi"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface shadow-2xs space-y-3">
        <h2 className="text-xs sm:text-sm font-bold text-foreground tracking-tight">
          {isEn ? "Contributions & Activity" : "Kontribusi & Aktivitas Anda"}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="p-3 rounded-lg border border-border bg-background space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase font-semibold">
              <FileCode className="w-3.5 h-3.5 text-foreground" />
              <span>Prompt Dikirim</span>
            </div>
            <div className="text-lg font-bold font-mono text-foreground">
              {stats.promptsCount}
            </div>
            <Link
              href={`/${locale}/prompts/submit`}
              className="inline-flex items-center gap-1 text-[11px] text-foreground font-medium hover:underline pt-0.5"
            >
              <span>{isEn ? "Submit New" : "Kirim Prompt Baru"}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-3 rounded-lg border border-border bg-background space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase font-semibold">
              <Layers className="w-3.5 h-3.5 text-foreground" />
              <span>Skill Dikirim</span>
            </div>
            <div className="text-lg font-bold font-mono text-foreground">
              {stats.skillsCount}
            </div>
            <Link
              href={`/${locale}/skills/submit`}
              className="inline-flex items-center gap-1 text-[11px] text-foreground font-medium hover:underline pt-0.5"
            >
              <span>{isEn ? "Submit New" : "Kirim Skill Baru"}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-3 rounded-lg border border-border bg-background space-y-1 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase font-semibold">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>Koleksi Favorit</span>
            </div>
            <div className="text-lg font-bold font-mono text-foreground">
              Favorit
            </div>
            <Link
              href={`/${locale}/favorites`}
              className="inline-flex items-center gap-1 text-[11px] text-foreground font-medium hover:underline pt-0.5"
            >
              <span>{isEn ? "Open Favorites" : "Buka Favorit"}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
