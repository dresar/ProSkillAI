"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import type { UiInspiration } from "@/db/schema";

interface DesignTrendFormProps {
  initialData?: UiInspiration | null;
  action: (prevState: unknown, formData: FormData) => Promise<{ error?: string; success?: boolean } | undefined>;
  title: string;
}

const CATEGORIES = [
  { value: "cards", label: "Cards & Grid" },
  { value: "agentic", label: "Agentic & AI" },
  { value: "nav", label: "Navigation" },
  { value: "forms", label: "Forms & Controls" },
  { value: "metrics", label: "Telemetry & Metrics" },
  { value: "modals", label: "Modals & Feedback" },
];

export function DesignTrendForm({ initialData, action, title }: DesignTrendFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [slug, setSlug] = React.useState(initialData?.slug || "");
  const [titleEn, setTitleEn] = React.useState(initialData?.titleEn || "");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitleEn(val);
    if (!initialData) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const defaultTokens = initialData?.designTokens
    ? JSON.stringify(initialData.designTokens, null, 2)
    : JSON.stringify(
        {
          radius: "8px",
          density: "Compact Non-Pill",
          contrast: "WCAG 2.2 AA",
        },
        null,
        2
      );

  return (
    <form action={formAction} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/design-trends"
            className="p-1.5 rounded-[6px] border border-border bg-surface text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-base font-bold text-foreground tracking-tight">{title}</h2>
            <p className="text-xs text-muted-foreground">Koleksi komponen UI antarmuka modern Neon</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-8 items-center gap-1.5 rounded-[6px] bg-foreground px-3 text-xs font-semibold text-background hover:opacity-90 active:scale-95 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isPending ? "Menyimpan..." : "Simpan Pola"}</span>
        </button>
      </div>

      {state?.error && (
        <div className="p-3 rounded-[6px] border border-rose-500/30 bg-rose-500/10 text-rose-500 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {state?.success && (
        <div className="p-3 rounded-[6px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Pola desain berhasil diperbarui.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground">Kategori *</label>
          <select
            name="category"
            defaultValue={initialData?.category || "cards"}
            className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground">Status Publikasi</label>
          <select
            name="status"
            defaultValue={initialData?.status || "published"}
            className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          >
            <option value="published">Published (Tayang)</option>
            <option value="draft">Draft (Draf)</option>
            <option value="archived">Archived (Arsip)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground">Slug URL *</label>
          <input
            name="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground">Judul (English) *</label>
          <input
            name="titleEn"
            type="text"
            required
            value={titleEn}
            onChange={handleTitleChange}
            className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground">Judul (Indonesia) *</label>
          <input
            name="titleId"
            type="text"
            required
            defaultValue={initialData?.titleId || ""}
            className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground">Deskripsi (English) *</label>
          <textarea
            name="descriptionEn"
            required
            rows={2}
            defaultValue={initialData?.descriptionEn || ""}
            className="w-full p-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground">Deskripsi (Indonesia) *</label>
          <textarea
            name="descriptionId"
            required
            rows={2}
            defaultValue={initialData?.descriptionId || ""}
            className="w-full p-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-foreground">Tags (Pisahkan koma)</label>
        <input
          name="tags"
          type="text"
          defaultValue={(initialData?.tags as string[] | null)?.join(", ") || ""}
          placeholder="Card, Marketplace, Compact, Dark Mode"
          className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-foreground">
          Kode Komponen Snippet (React / JSX) *
        </label>
        <textarea
          name="componentSnippet"
          required
          rows={10}
          defaultValue={initialData?.componentSnippet || ""}
          placeholder="export function CompactCard() { ... }"
          className="w-full p-2.5 rounded-[6px] border border-border bg-surface font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground">
            Kelas Tailwind CSS Standar
          </label>
          <textarea
            name="tailwindClasses"
            rows={4}
            defaultValue={initialData?.tailwindClasses || ""}
            placeholder="rounded-[8px] border border-border/80 bg-surface p-3"
            className="w-full p-2.5 rounded-[6px] border border-border bg-surface font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground">
            Design Tokens (JSON)
          </label>
          <textarea
            name="designTokensJson"
            rows={4}
            defaultValue={defaultTokens}
            className="w-full p-2.5 rounded-[6px] border border-border bg-surface font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground">
            Panduan UX (English)
          </label>
          <textarea
            name="uxGuidelinesEn"
            rows={3}
            defaultValue={initialData?.uxGuidelinesEn || ""}
            className="w-full p-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground">
            Panduan UX (Indonesia)
          </label>
          <textarea
            name="uxGuidelinesId"
            rows={3}
            defaultValue={initialData?.uxGuidelinesId || ""}
            className="w-full p-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-foreground">
          Preview Image URL (Opsional)
        </label>
        <input
          name="previewImageUrl"
          type="url"
          defaultValue={initialData?.previewImageUrl || ""}
          placeholder="https://..."
          className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
        />
      </div>

      <div className="pt-4 border-t border-border flex justify-end gap-2">
        <Link
          href="/admin/design-trends"
          className="inline-flex h-8 items-center px-3 rounded-[6px] border border-border bg-surface text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-8 items-center gap-1.5 rounded-[6px] bg-foreground px-4 text-xs font-semibold text-background hover:opacity-90 active:scale-95 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isPending ? "Menyimpan..." : "Simpan Pola"}</span>
        </button>
      </div>
    </form>
  );
}
