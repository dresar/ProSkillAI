"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  Edit3,
  ArrowLeft,
} from "lucide-react";
import {
  parseRawSkillAction,
  fetchGitHubSkillAction,
  submitUserSkillAction,
} from "./actions";
import { ClientMarkdownRenderer } from "@/components/client-markdown-renderer";
import type { Category } from "@/db/schema";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

interface SubmitClientProps {
  categories: Category[];
  locale: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export function SubmitClient({ categories, locale, user }: SubmitClientProps) {
  const isEn = locale === "en";
  const [state, formAction, isPending] = useActionState(
    submitUserSkillAction,
    null
  );

  const [mode, setMode] = React.useState<"smart" | "github" | "manual">("smart");
  const [rawText, setRawText] = React.useState("");
  const [isParsing, setIsParsing] = React.useState(false);
  const [parseMessage, setParseMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [githubUrl, setGithubUrl] = React.useState("");
  const [isFetchingGithub, setIsFetchingGithub] = React.useState(false);

  const [activeLang, setActiveLang] = React.useState<"id" | "en">("id");
  const [previewTab, setPreviewTab] = React.useState<"edit" | "preview">("edit");

  const [titleId, setTitleId] = React.useState("");
  const [titleEn, setTitleEn] = React.useState("");
  const [summaryId, setSummaryId] = React.useState("");
  const [summaryEn, setSummaryEn] = React.useState("");
  const [contentId, setContentId] = React.useState("");
  const [contentEn, setContentEn] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [tagsInput, setTagsInput] = React.useState("");
  const [license, setLicense] = React.useState("MIT");
  const [authorName, setAuthorName] = React.useState(user?.name || "");
  const [authorUrl, setAuthorUrl] = React.useState("");
  const [repoUrl, setRepoUrl] = React.useState("");
  const [sourceType, setSourceType] = React.useState<"original" | "github">("original");

  const handleSmartParse = async () => {
    if (!rawText.trim()) return;
    setIsParsing(true);
    setParseMessage(null);

    const res = await parseRawSkillAction(rawText);
    setIsParsing(false);

    if (res.error) {
      setParseMessage({ type: "error", text: res.error });
      return;
    }

    if (res.data) {
      if (res.data.title) {
        setTitleId(res.data.title);
        setTitleEn(res.data.title);
      }
      if (res.data.summary) {
        setSummaryId(res.data.summary);
        setSummaryEn(res.data.summary);
      }
      if (res.data.content) {
        setContentId(res.data.content);
        setContentEn(res.data.content);
      }
      if (res.data.slug) {
        setSlug(res.data.slug);
      }
      if (res.data.tags && res.data.tags.length > 0) {
        setTagsInput(res.data.tags.join(", "));
      }
      if (res.data.license) {
        setLicense(res.data.license);
      }
      if (res.data.author) {
        setAuthorName(res.data.author);
      }

      setParseMessage({
        type: "success",
        text: isEn
          ? "Successfully extracted metadata and content from SKILL.md!"
          : "Berhasil mengekstrak judul, deskripsi, lisensi, dan konten dari SKILL.md!",
      });
      setMode("manual");
    }
  };

  const handleGitHubFetch = async () => {
    if (!githubUrl.trim()) return;
    setIsFetchingGithub(true);
    setParseMessage(null);

    const res = await fetchGitHubSkillAction(githubUrl);
    setIsFetchingGithub(false);

    if (res.error) {
      setParseMessage({ type: "error", text: res.error });
      return;
    }

    if (res.data) {
      setTitleId(res.data.title);
      setTitleEn(res.data.title);
      setSummaryId(res.data.summary);
      setSummaryEn(res.data.summary);
      setContentId(res.data.content);
      setContentEn(res.data.content);
      setSlug(res.data.slug);
      setLicense(res.data.license || "MIT");
      setAuthorName(res.data.author);
      setAuthorUrl(res.data.authorUrl);
      setRepoUrl(res.data.repoUrl);
      setSourceType("github");

      setParseMessage({
        type: "success",
        text: isEn
          ? "Successfully fetched and parsed repository SKILL.md!"
          : "Berhasil mengambil dan memproses berkas SKILL.md dari GitHub!",
      });
      setMode("manual");
    }
  };

  const generateSlugFromTitle = (val: string) => {
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
                ? "Skill Submitted Successfully!"
                : "Skill Berhasil Dikirim!"
              : isEn
              ? "Skill Published!"
              : "Skill Berhasil Dipublikasikan!"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isPendingApproval
              ? isEn
                ? "Your skill has been queued for review by the curator team. Once verified, it will appear publicly in the catalog."
                : "Skill Anda telah masuk ke antrean kurasi. Setelah ditinjau oleh admin, skill akan otomatis tayang di katalog publik."
              : isEn
              ? "Your skill is now live and accessible in the public registry."
              : "Skill Anda sekarang sudah aktif dan dapat diakses publik di katalog."}
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5">
          <Link
            href={`/${locale}/skills`}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground text-xs font-medium transition-colors"
          >
            <span>{isEn ? "Browse Catalog" : "Lihat Katalog"}</span>
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[6px] bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-transform active:scale-95"
          >
            <span>{isEn ? "Submit Another Skill" : "Kirim Skill Lain"}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl space-y-5">
      <div>
        <Link
          href={`/${locale}/skills`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>{isEn ? "Back to Skills" : "Kembali ke Katalog Skill"}</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-foreground" />
            <span>{isEn ? "Community Contributor" : "Kontributor Komunitas"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {isEn ? "Submit AI Agent Skill" : "Kirim Skill AI Agent"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            {isEn
              ? "Add your custom agent instructions, rules, or tools to the open registry."
              : "Daftarkan instruksi sistem, aturan agent koding, atau perkakas AI buatan Anda ke katalog terbuka."}
          </p>
        </div>

        <div className="inline-flex rounded-[6px] border border-border p-0.5 bg-muted/40 shrink-0">
          <button
            type="button"
            onClick={() => setMode("smart")}
            className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[5px] text-xs font-medium transition-colors cursor-pointer ${
              mode === "smart"
                ? "bg-surface text-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? "Smart Paste" : "Parser Cerdas"}</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("github")}
            className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[5px] text-xs font-medium transition-colors cursor-pointer ${
              mode === "github"
                ? "bg-surface text-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GitHubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[5px] text-xs font-medium transition-colors cursor-pointer ${
              mode === "manual"
                ? "bg-surface text-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEn ? "Manual Form" : "Formulir"}</span>
          </button>
        </div>
      </div>

      {parseMessage && (
        <div
          className={`p-3 rounded-[6px] border text-xs flex items-center justify-between gap-2 ${
            parseMessage.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
              : "border-rose-500/40 bg-rose-500/10 text-rose-500"
          }`}
        >
          <div className="flex items-center gap-2">
            {parseMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{parseMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setParseMessage(null)}
            className="text-[11px] hover:underline font-mono"
          >
            Tutup
          </button>
        </div>
      )}

      {mode === "smart" && (
        <div className="p-5 rounded-xl border border-border bg-surface space-y-4 shadow-2xs">
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-foreground" />
              <span>{isEn ? "Smart SKILL.md Parser" : "Parser SKILL.md Otomatis"}</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEn
                ? "Paste the raw text of your SKILL.md. We will automatically detect YAML frontmatter, title, summary, tags, and license."
                : "Tempelkan teks mentah SKILL.md Anda. Sistem akan mendeteksi judul, deskripsi, tag, lisensi, dan konten secara otomatis."}
            </p>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={10}
            placeholder={`---
name: Web Architect Pro
description: Standar arsitektur web modern anti-slop.
license: MIT
tags: [architecture, web, typescript]
---

# Web Architect Pro
Instruksi skill lengkap...`}
            className="w-full p-3 rounded-[6px] border border-border bg-background text-foreground text-xs font-mono focus:outline-2 focus:outline-foreground leading-relaxed resize-y placeholder:text-muted-foreground/50"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-muted-foreground font-mono">
              {rawText.length} karakter
            </span>
            <button
              type="button"
              disabled={isParsing || !rawText.trim()}
              onClick={handleSmartParse}
              className="inline-flex items-center gap-2 h-8 px-4 rounded-[6px] bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isParsing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>{isParsing ? "Menganalisis..." : "Ekstrak & Isi Formulir"}</span>
            </button>
          </div>
        </div>
      )}

      {mode === "github" && (
        <div className="p-5 rounded-xl border border-border bg-surface space-y-4 shadow-2xs">
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <GitHubIcon className="w-4 h-4 text-foreground" />
              <span>{isEn ? "Import from GitHub" : "Ambil Otomatis dari GitHub"}</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEn
                ? "Enter a public GitHub repository or direct link to a SKILL.md file."
                : "Masukkan URL repositori GitHub publik atau tautan langsung ke file SKILL.md."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/owner/repo/blob/main/SKILL.md"
              className="flex-1 h-9 px-3 rounded-[6px] border border-border bg-background text-foreground text-xs font-mono focus:outline-2 focus:outline-foreground"
            />
            <button
              type="button"
              disabled={isFetchingGithub || !githubUrl.trim()}
              onClick={handleGitHubFetch}
              className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-[6px] bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs shrink-0"
            >
              {isFetchingGithub ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <GitHubIcon className="w-3.5 h-3.5" />
              )}
              <span>{isFetchingGithub ? "Mengambil..." : "Ambil & Ekstrak"}</span>
            </button>
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="sourceType" value={sourceType} />
        <input type="hidden" name="repoUrl" value={repoUrl} />

        {state?.error && (
          <div className="p-3 rounded-[6px] border border-rose-500/40 bg-rose-500/10 text-rose-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        <div className="p-5 rounded-xl border border-border bg-surface space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <h3 className="text-sm font-semibold text-foreground">
              {isEn ? "1. General Information" : "1. Informasi Utama Skill"}
            </h3>
            <div className="inline-flex rounded-[5px] border border-border p-0.5 bg-muted/40">
              <button
                type="button"
                onClick={() => setActiveLang("id")}
                className={`h-6 px-2 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  activeLang === "id"
                    ? "bg-surface text-foreground font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Indonesia
              </button>
              <button
                type="button"
                onClick={() => setActiveLang("en")}
                className={`h-6 px-2 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  activeLang === "en"
                    ? "bg-surface text-foreground font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="submit-title-id"
                className="block text-xs font-medium text-foreground mb-1.5"
              >
                Judul Skill (Indonesia) *
              </label>
              <input
                id="submit-title-id"
                name="titleId"
                type="text"
                required
                value={titleId}
                onChange={(e) => {
                  setTitleId(e.target.value);
                  if (!slug) generateSlugFromTitle(e.target.value);
                }}
                placeholder="mis. Arsitektur Kode Bersih"
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground"
              />
            </div>

            <div>
              <label
                htmlFor="submit-title-en"
                className="block text-xs font-medium text-foreground mb-1.5"
              >
                Skill Title (English) *
              </label>
              <input
                id="submit-title-en"
                name="titleEn"
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Clean Code Architecture"
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="submit-summary-id"
                className="block text-xs font-medium text-foreground mb-1.5"
              >
                Ringkasan Singkat (Indonesia) *
              </label>
              <textarea
                id="submit-summary-id"
                name="summaryId"
                required
                rows={2}
                value={summaryId}
                onChange={(e) => setSummaryId(e.target.value)}
                placeholder="Pedoman taktis untuk menyusun struktur kode terorganisir..."
                className="w-full p-2.5 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground resize-y leading-relaxed"
              />
            </div>

            <div>
              <label
                htmlFor="submit-summary-en"
                className="block text-xs font-medium text-foreground mb-1.5"
              >
                Summary (English) *
              </label>
              <textarea
                id="submit-summary-en"
                name="summaryEn"
                required
                rows={2}
                value={summaryEn}
                onChange={(e) => setSummaryEn(e.target.value)}
                placeholder="Tactical guidelines for organizing clean code architecture..."
                className="w-full p-2.5 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground resize-y leading-relaxed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label
                htmlFor="submit-slug"
                className="block text-xs font-medium text-foreground mb-1.5"
              >
                URL Slug *
              </label>
              <input
                id="submit-slug"
                name="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="clean-code-architecture"
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-background text-foreground text-xs font-mono focus:outline-2 focus:outline-foreground"
              />
            </div>

            <div>
              <label
                htmlFor="submit-category"
                className="block text-xs font-medium text-foreground mb-1.5"
              >
                {isEn ? "Category" : "Kategori"}
              </label>
              <select
                id="submit-category"
                name="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-8 px-2 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground"
              >
                <option value="">{isEn ? "Select Category" : "Pilih Kategori"}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isEn ? c.nameEn : c.nameId}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="submit-tags"
                className="block text-xs font-medium text-foreground mb-1.5"
              >
                Tags (pisahkan koma)
              </label>
              <input
                id="submit-tags"
                name="tags"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="coding, typescript, agent"
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground"
              />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-border bg-surface space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <h3 className="text-sm font-semibold text-foreground">
              {isEn ? "2. SKILL.md Content" : "2. Isi Lengkap SKILL.md"}
            </h3>
            <div className="inline-flex rounded-[5px] border border-border p-0.5 bg-muted/40">
              <button
                type="button"
                onClick={() => setPreviewTab("edit")}
                className={`inline-flex items-center gap-1 h-6 px-2 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  previewTab === "edit"
                    ? "bg-surface text-foreground font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("preview")}
                className={`inline-flex items-center gap-1 h-6 px-2 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  previewTab === "preview"
                    ? "bg-surface text-foreground font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Pratinjau</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {activeLang === "id" ? (
              <div>
                <label
                  htmlFor="submit-content-id"
                  className="block text-xs font-medium text-foreground mb-1.5"
                >
                  Konten Markdown (Indonesia) *
                </label>
                {previewTab === "edit" ? (
                  <textarea
                    id="submit-content-id"
                    name="contentId"
                    required
                    rows={12}
                    value={contentId}
                    onChange={(e) => setContentId(e.target.value)}
                    placeholder="# Judul Skill&#10;&#10;Instruksi lengkap..."
                    className="w-full p-3 rounded-[6px] border border-border bg-background text-foreground text-xs font-mono focus:outline-2 focus:outline-foreground leading-relaxed resize-y"
                  />
                ) : (
                  <div className="p-4 rounded-[6px] border border-border bg-background max-h-96 overflow-y-auto">
                    <ClientMarkdownRenderer content={contentId || "*(Belum ada konten)*"} />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label
                  htmlFor="submit-content-en"
                  className="block text-xs font-medium text-foreground mb-1.5"
                >
                  Markdown Content (English) *
                </label>
                {previewTab === "edit" ? (
                  <textarea
                    id="submit-content-en"
                    name="contentEn"
                    required
                    rows={12}
                    value={contentEn}
                    onChange={(e) => setContentEn(e.target.value)}
                    placeholder="# Skill Title&#10;&#10;Full instructions..."
                    className="w-full p-3 rounded-[6px] border border-border bg-background text-foreground text-xs font-mono focus:outline-2 focus:outline-foreground leading-relaxed resize-y"
                  />
                ) : (
                  <div className="p-4 rounded-[6px] border border-border bg-background max-h-96 overflow-y-auto">
                    <ClientMarkdownRenderer content={contentEn || "*(No content)*"} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-border bg-surface space-y-4 shadow-2xs">
          <h3 className="text-sm font-semibold text-foreground pb-3 border-b border-border/80">
            {isEn ? "3. Author & License Attribution" : "3. Pengarang & Lisensi"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="submit-author-name"
                className="block text-xs font-medium text-foreground mb-1.5"
              >
                Nama Pengarang / Tim
              </label>
              <input
                id="submit-author-name"
                name="authorName"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Nama Anda atau Komunitas"
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground"
              />
            </div>

            <div>
              <label
                htmlFor="submit-author-url"
                className="block text-xs font-medium text-foreground mb-1.5"
              >
                Tautan Profil / Website
              </label>
              <input
                id="submit-author-url"
                name="authorUrl"
                type="url"
                value={authorUrl}
                onChange={(e) => setAuthorUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground"
              />
            </div>

            <div>
              <label
                htmlFor="submit-license"
                className="block text-xs font-medium text-foreground mb-1.5"
              >
                Lisensi
              </label>
              <input
                id="submit-license"
                name="license"
                type="text"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                placeholder="MIT / Apache-2.0"
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Link
            href={`/${locale}/skills`}
            className="h-8 px-3.5 rounded-[6px] border border-border hover:bg-muted text-foreground text-xs font-medium inline-flex items-center justify-center transition-colors"
          >
            {isEn ? "Cancel" : "Batal"}
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 h-9 px-5 rounded-[6px] bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>
              {isPending
                ? isEn
                  ? "Submitting..."
                  : "Mengirimkan..."
                : isEn
                ? "Submit Skill"
                : "Kirim Skill Sekarang"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
