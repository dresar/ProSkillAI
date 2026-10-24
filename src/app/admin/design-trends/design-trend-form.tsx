"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, CheckCircle2, Sparkles, ChevronDown, ChevronRight, Images, X } from "lucide-react";
import type { UiInspiration } from "@/db/schema";
import { MediaGalleryDialog } from "@/components/admin/media-gallery-dialog";

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
  const [primaryTitle, setPrimaryTitle] = React.useState(initialData?.titleId || initialData?.titleEn || "");
  const [primaryDesc, setPrimaryDesc] = React.useState(initialData?.descriptionId || initialData?.descriptionEn || "");
  const [titleId, setTitleId] = React.useState(initialData?.titleId || "");
  const [titleEn, setTitleEn] = React.useState(initialData?.titleEn || "");
  const [descriptionId, setDescriptionId] = React.useState(initialData?.descriptionId || "");
  const [descriptionEn, setDescriptionEn] = React.useState(initialData?.descriptionEn || "");
  const [previewImageUrl, setPreviewImageUrl] = React.useState(initialData?.previewImageUrl || "");
  const [galleryOpen, setGalleryOpen] = React.useState(false);
  const [showAdvancedLocale, setShowAdvancedLocale] = React.useState(false);
  const [isTranslating, setIsTranslating] = React.useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPrimaryTitle(val);
    setTitleId(val);
    if (!initialData && !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleAutoTranslate = async () => {
    if (!primaryTitle.trim() && !primaryDesc.trim()) return;
    setIsTranslating(true);
    try {
      if (primaryTitle.trim()) {
        const resTitle = await fetch("/api/ai/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: primaryTitle.trim(), type: "title", direction: "id-to-en" }),
        });
        const titleData = await resTitle.json();
        if (titleData?.success && titleData?.translatedText) {
          setTitleEn(titleData.translatedText);
          if (!slug) {
            setSlug(
              titleData.translatedText
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "")
            );
          }
        }
      }

      if (primaryDesc.trim()) {
        const resDesc = await fetch("/api/ai/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: primaryDesc.trim(), type: "description", direction: "id-to-en" }),
        });
        const descData = await resDesc.json();
        if (descData?.success && descData?.translatedText) {
          setDescriptionEn(descData.translatedText);
        }
      }
      setShowAdvancedLocale(true);
    } catch {}
    setIsTranslating(false);
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
          className="inline-flex h-8 items-center gap-1.5 rounded-[6px] bg-foreground px-3.5 text-xs font-semibold text-background hover:opacity-90 active:scale-95 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
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
          <label className="block text-xs font-semibold text-foreground">Slug URL (Opsional)</label>
          <input
            name="slug"
            type="text"
            placeholder="Otomatis dari judul jika kosong"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
      </div>

      <div className="space-y-4 rounded-[8px] border border-border/80 bg-surface/50 p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-foreground">Konten Utama</span>
            <p className="text-[11px] text-muted-foreground">
              Cukup isi satu bahasa saja — sistem AI akan menerjemahkan otomatis ke bahasa pasangannya saat disimpan.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAutoTranslate}
            disabled={isTranslating}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isTranslating ? "Menerjemahkan..." : "Terjemahkan AI"}</span>
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground">Judul Pola *</label>
          <input
            name="title"
            type="text"
            required
            value={primaryTitle}
            onChange={handleTitleChange}
            placeholder="e.g. Compact Marketplace Card atau Kartu Pasar Ringkas"
            className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground">Deskripsi Pola *</label>
          <textarea
            name="description"
            required
            rows={2}
            value={primaryDesc}
            onChange={(e) => {
              setPrimaryDesc(e.target.value);
              setDescriptionId(e.target.value);
            }}
            placeholder="Tulis ringkasan singkat fungsi dan estetika komponen ini..."
            className="w-full p-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
          />
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowAdvancedLocale(!showAdvancedLocale)}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {showAdvancedLocale ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>Kustomisasi Dwibahasa Manual (Opsional)</span>
          </button>

          {showAdvancedLocale && (
            <div className="mt-3 space-y-3 pt-3 border-t border-border/60 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-foreground">Judul (Indonesia)</label>
                  <input
                    name="titleId"
                    type="text"
                    value={titleId || primaryTitle}
                    onChange={(e) => setTitleId(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-foreground">Title (English)</label>
                  <input
                    name="titleEn"
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Auto-translated jika kosong"
                    className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-foreground">Deskripsi (Indonesia)</label>
                  <textarea
                    name="descriptionId"
                    rows={2}
                    value={descriptionId || primaryDesc}
                    onChange={(e) => setDescriptionId(e.target.value)}
                    className="w-full p-2 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-foreground">Description (English)</label>
                  <textarea
                    name="descriptionEn"
                    rows={2}
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="Auto-translated jika kosong"
                    className="w-full p-2 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          )}
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

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-foreground">
          Panduan UX (Opsional)
        </label>
        <textarea
          name="uxGuidelines"
          rows={3}
          defaultValue={initialData?.uxGuidelinesId || initialData?.uxGuidelinesEn || ""}
          placeholder="Rekomendasi penggunaan, pertimbangan aksesibilitas kontras WCAG AA..."
          className="w-full p-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-foreground">
            Preview Image URL (Opsional)
          </label>
          <button
            type="button"
            onClick={() => setGalleryOpen(true)}
            className="inline-flex items-center gap-1.5 h-6 px-2 rounded-[5px] bg-foreground text-background text-[11px] font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <Images className="w-3 h-3" />
            <span>Pustaka Galeri</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <input
            name="previewImageUrl"
            type="url"
            value={previewImageUrl}
            onChange={(e) => setPreviewImageUrl(e.target.value)}
            placeholder="https://cdn.jsdelivr.net/... atau pilih dari galeri"
            className="flex-1 h-8 px-2.5 font-mono text-xs rounded-[6px] border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          {previewImageUrl && (
            <button
              type="button"
              onClick={() => setPreviewImageUrl("")}
              className="h-8 px-2 rounded-[6px] border border-border text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              title="Hapus tautan gambar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {previewImageUrl && (
          <div className="relative aspect-video max-w-xs rounded-[6px] border border-border overflow-hidden bg-background">
            <img
              src={previewImageUrl}
              alt="Pratinjau Pola"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <MediaGalleryDialog
          open={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          defaultFolder="ui"
          onSelect={(url) => setPreviewImageUrl(url)}
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
