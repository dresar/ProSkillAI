"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import {
  FileCode,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Variable,
  ArrowLeft,
} from "lucide-react";
import { submitPromptAction } from "./actions";
import type { Category } from "@/db/schema";
import type { PublicUser } from "@/components/public-user-nav";

interface SubmitPromptClientProps {
  categories: Category[];
  locale: string;
  user: PublicUser;
}

export function SubmitPromptClient({
  categories,
  locale,
  user,
}: SubmitPromptClientProps) {
  const [state, formAction, isPending] = useActionState(submitPromptAction, null);
  const isEn = locale === "en";

  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [content, setContent] = React.useState("");
  const [detectedVars, setDetectedVars] = React.useState<string[]>([]);

  React.useEffect(() => {
    const matches = content.match(/\[([a-zA-Z0-9_\-\s]+)\]/g) || [];
    const cleaned = Array.from(
      new Set(
        matches
          .map((m) => m.replace(/^\[|\]$/g, "").trim())
          .filter((v) => v.length > 0 && v.length <= 40)
      )
    );
    setDetectedVars(cleaned);
  }, [content]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const s = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(s);
  };

  if (state?.success) {
    const isPendingApproval = state.status === "pending";

    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {isPendingApproval
              ? isEn
                ? "Prompt Submitted Successfully!"
                : "Prompt Berhasil Dikirim!"
              : isEn
              ? "Prompt Published!"
              : "Prompt Berhasil Dipublikasikan!"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isPendingApproval
              ? isEn
                ? "Your prompt template has been queued for review by the curator team. Once approved, it will appear publicly in the library."
                : "Templat prompt Anda telah masuk ke antrean kurasi. Setelah ditinjau oleh admin, prompt akan otomatis tayang di katalog publik."
              : isEn
              ? "Your prompt is now live and accessible in the public registry."
              : "Prompt Anda sekarang sudah aktif dan dapat diakses publik di katalog."}
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5">
          <Link
            href={`/${locale}/prompts`}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground text-xs font-medium transition-colors"
          >
            <span>{isEn ? "Browse Prompts" : "Lihat Koleksi Prompt"}</span>
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[6px] bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-transform active:scale-95 cursor-pointer"
          >
            <span>{isEn ? "Submit Another Prompt" : "Kirim Prompt Lain"}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-5">
      <div className="mb-2 lg:hidden">
        <Link
          href={`/${locale}/prompts`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>{isEn ? "Back" : "Kembali"}</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-foreground" />
            <span>{isEn ? "Community Contributor" : "Kontributor Komunitas"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {isEn ? "Submit Prompt Template" : "Kirim Templat Prompt"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            {isEn
              ? "Share your reusable AI prompt engineering instructions or reasoning workflows."
              : "Bagikan templat prompt engineering atau workflow reasoning siap pakai ke komunitas."}
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-border bg-surface text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{user.email}</span>
        </div>
      </div>

      <form action={formAction} className="space-y-5">
        {state?.error && (
          <div
            role="alert"
            className="p-3.5 rounded-[6px] border border-rose-500/40 bg-rose-500/10 text-rose-500 text-xs flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        <div className="p-5 rounded-xl border border-border bg-surface space-y-4 shadow-2xs">
          <h2 className="text-sm font-semibold text-foreground tracking-tight">
            {isEn ? "Prompt Details" : "Informasi Prompt"}
          </h2>

          <div className="space-y-1.5">
            <label htmlFor="title" className="block text-xs font-medium text-foreground">
              {isEn ? "Prompt Title *" : "Judul Prompt *"}
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder={isEn ? "e.g. Master Codebase Security Audit Prompt" : "mis. Master Prompt Audit Keamanan Codebase"}
              className="w-full h-9 px-3 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="slug" className="block text-xs font-medium text-foreground">
                Slug URL *
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="master-codebase-security-audit"
                className="w-full h-9 px-3 rounded-[6px] border border-border bg-background text-foreground text-xs font-mono focus:outline-2 focus:outline-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="categoryId" className="block text-xs font-medium text-foreground">
                {isEn ? "Category" : "Kategori"}
              </label>
              <select
                id="categoryId"
                name="categoryId"
                defaultValue=""
                className="w-full h-9 px-3 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground cursor-pointer"
              >
                <option value="">{isEn ? "Select Category" : "Pilih Kategori"}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isEn ? c.nameEn : c.nameId}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-xs font-medium text-foreground">
              {isEn ? "Short Description *" : "Deskripsi Singkat *"}
            </label>
            <textarea
              id="description"
              name="description"
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isEn ? "Brief summary of intent, expected output, and execution steps..." : "Deskripsi singkat tujuan, output yang dihasilkan, dan cara penggunaannya..."}
              className="w-full p-2.5 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground resize-y leading-relaxed"
            />
          </div>
        </div>

        <div className="p-5 rounded-xl border border-border bg-surface space-y-4 shadow-2xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
                <FileCode className="w-4 h-4 text-foreground" />
                <span>{isEn ? "Prompt Template Content *" : "Isi Templat Prompt *"}</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isEn
                  ? "Use bracket syntax like [project_name] or [target_framework] for dynamic variables."
                  : "Gunakan tanda kurung siku seperti [nama_proyek] atau [framework] untuk variabel dinamis."}
              </p>
            </div>

            {detectedVars.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                  <Variable className="w-3.5 h-3.5" />
                  <span>{detectedVars.length} variabel:</span>
                </span>
                {detectedVars.map((v) => (
                  <span
                    key={v}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  >
                    [{v}]
                  </span>
                ))}
              </div>
            )}
          </div>

          <input type="hidden" name="variables" value={detectedVars.join(",")} />

          <div className="space-y-1.5">
            <textarea
              id="content"
              name="content"
              rows={13}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Bertindaklah sebagai Senior Security Engineer. Audit seluruh codebase pada repositori [nama_repo] yang menggunakan [framework].

Fokuskan pemeriksaan pada:
1. Validasi input dan OWASP Top 10
2. Sanitasi query SQL dan perlindungan injeksi
3. Pengelolaan environment secrets pada file [.env]

Hasilkan laporan berformat markdown dengan tabel rekomendasi prioritas.`}
              className="w-full p-3.5 rounded-[6px] border border-border bg-background text-foreground text-xs font-mono focus:outline-2 focus:outline-foreground resize-y leading-relaxed"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href={`/${locale}/prompts`}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground text-xs font-medium transition-colors"
          >
            <span>{isEn ? "Cancel" : "Batal"}</span>
          </Link>
          <button
            type="submit"
            disabled={isPending || !title.trim() || !content.trim()}
            className="inline-flex items-center gap-2 h-9 px-5 rounded-[6px] bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <span>{isPending ? "Mengirim..." : isEn ? "Submit Prompt" : "Kirim Prompt"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
