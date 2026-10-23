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
  FileCode,
} from "lucide-react";
import {
  parseRawSkillAction,
  fetchGitHubSkillAction,
  submitUserSkillAction,
} from "./actions";
import { ClientMarkdownRenderer } from "@/components/client-markdown-renderer";
import { SkillFilesManager } from "@/components/skill-files-manager";
import type { Category, SkillFileItem } from "@/db/schema";

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

  const [previewTab, setPreviewTab] = React.useState<"edit" | "preview">("edit");

  const [title, setTitle] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [content, setContent] = React.useState("");
  const [files, setFiles] = React.useState<SkillFileItem[]>([]);
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
      if (res.data.title) setTitle(res.data.title);
      if (res.data.summary) setSummary(res.data.summary);
      if (res.data.content) setContent(res.data.content);
      if (res.data.slug) setSlug(res.data.slug);
      if (res.data.tags && res.data.tags.length > 0) {
        setTagsInput(res.data.tags.join(", "));
      }
      if (res.data.license) setLicense(res.data.license);
      if (res.data.author) setAuthorName(res.data.author);

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
      setTitle(res.data.title);
      setSummary(res.data.summary);
      setContent(res.data.content);
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
                ? "Your skill has been queued for review by the curator team. Once approved, it will appear publicly in the library."
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
            <span>{isEn ? "Browse Skills" : "Lihat Koleksi Skill"}</span>
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[6px] bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-transform active:scale-95 cursor-pointer"
          >
            <span>{isEn ? "Submit Another Skill" : "Kirim Skill Lain"}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-5">
      <div className="mb-2 lg:hidden">
        <Link
          href={`/${locale}/skills`}
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
            <span>{isEn ? "Community Submission" : "Kontributor Komunitas"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {isEn ? "Submit New AI Skill" : "Kirim Skill AI Baru"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            {isEn
              ? "Publish your custom AI instructions, tool definitions, and auxiliary scripts."
              : "Bagikan instruksi AI kustom, berkas konfigurasi, dan script pendukung ke komunitas."}
          </p>
        </div>

        {user && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-border bg-surface text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{user.email}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 p-1 rounded-lg border border-border bg-surface w-fit">
        <button
          type="button"
          onClick={() => setMode("smart")}
          className={`h-7 px-3 rounded-[5px] text-xs font-medium transition-colors cursor-pointer ${
            mode === "smart"
              ? "bg-foreground text-background font-semibold shadow-2xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {isEn ? "Paste SKILL.md" : "Tempel SKILL.md"}
        </button>
        <button
          type="button"
          onClick={() => setMode("github")}
          className={`inline-flex items-center gap-1.5 h-7 px-3 rounded-[5px] text-xs font-medium transition-colors cursor-pointer ${
            mode === "github"
              ? "bg-foreground text-background font-semibold shadow-2xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <GitHubIcon className="w-3.5 h-3.5" />
          <span>GitHub</span>
        </button>
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`h-7 px-3 rounded-[5px] text-xs font-medium transition-colors cursor-pointer ${
            mode === "manual"
              ? "bg-foreground text-background font-semibold shadow-2xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {isEn ? "Manual Form" : "Form Manual"}
        </button>
      </div>

      {parseMessage && (
        <div
          role="alert"
          className={`p-3.5 rounded-[6px] border text-xs flex items-center gap-2 ${
            parseMessage.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-rose-500/40 bg-rose-500/10 text-rose-500"
          }`}
        >
          {parseMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{parseMessage.text}</span>
        </div>
      )}

      {mode === "smart" && (
        <div className="p-5 rounded-xl border border-border bg-surface space-y-3.5 shadow-2xs">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {isEn ? "Smart SKILL.md Extractor" : "Ekstraksi Otomatis SKILL.md"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEn
                ? "Paste your raw markdown content with frontmatter. The parser will extract title, summary, license, and tags automatically."
                : "Tempel konten markdown SKILL.md Anda. Sistem akan mengekstrak judul, deskripsi, lisensi, dan tag secara otomatis."}
            </p>
          </div>

          <textarea
            rows={7}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={`---
name: Clean Code Architecture
description: Tactical guidelines for building clean software architecture
tags: ["clean-code", "refactoring"]
license: MIT
---

# Clean Code Guidelines...`}
            className="w-full p-3 rounded-[6px] border border-border bg-background text-foreground font-mono text-xs focus:outline-2 focus:outline-foreground resize-y leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSmartParse}
              disabled={isParsing || !rawText.trim()}
              className="inline-flex items-center gap-1.5 h-8 px-4 rounded-[6px] bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-all active:scale-95 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              {isParsing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isParsing ? "Memproses..." : "Ekstrak Metadata"}</span>
            </button>
          </div>
        </div>
      )}

      {mode === "github" && (
        <div className="p-5 rounded-xl border border-border bg-surface space-y-3.5 shadow-2xs">
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <GitHubIcon className="w-4 h-4" />
              <span>{isEn ? "Import from GitHub Repository" : "Impor dari Repositori GitHub"}</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEn
                ? "Provide a public repository URL containing a SKILL.md or README.md."
                : "Masukkan tautan repositori GitHub publik yang memiliki berkas SKILL.md atau README.md."}
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/owner/repo atau https://github.com/owner/repo/tree/main/skills/my-skill"
              className="flex-1 h-9 px-3 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground"
            />
            <button
              type="button"
              onClick={handleGitHubFetch}
              disabled={isFetchingGithub || !githubUrl.trim()}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[6px] bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-all active:scale-95 disabled:opacity-40 cursor-pointer shadow-2xs shrink-0"
            >
              {isFetchingGithub ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <GitHubIcon className="w-3.5 h-3.5" />}
              <span>{isFetchingGithub ? "Mengambil..." : "Ambil & Ekstrak"}</span>
            </button>
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="sourceType" value={sourceType} />
        <input type="hidden" name="repoUrl" value={repoUrl} />
        <input type="hidden" name="filesJson" value={JSON.stringify(files)} />

        <input type="hidden" name="titleId" value={title} />
        <input type="hidden" name="titleEn" value={title} />
        <input type="hidden" name="summaryId" value={summary} />
        <input type="hidden" name="summaryEn" value={summary} />
        <input type="hidden" name="contentId" value={content} />
        <input type="hidden" name="contentEn" value={content} />

        {state?.error && (
          <div className="p-3 rounded-[6px] border border-rose-500/40 bg-rose-500/10 text-rose-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        <div className="p-5 rounded-xl border border-border bg-surface space-y-4 shadow-2xs">
          <h3 className="text-sm font-semibold text-foreground pb-2 border-b border-border/80">
            {isEn ? "1. General Information" : "1. Informasi Utama Skill"}
          </h3>

          <div className="space-y-1.5">
            <label htmlFor="submit-title" className="block text-xs font-medium text-foreground">
              {isEn ? "Skill Title *" : "Judul Skill *"}
            </label>
            <input
              id="submit-title"
              name="title"
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slug) generateSlugFromTitle(e.target.value);
              }}
              placeholder={isEn ? "e.g. Clean Code Architecture" : "mis. Arsitektur Kode Bersih"}
              className="w-full h-9 px-3 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="submit-summary" className="block text-xs font-medium text-foreground">
              {isEn ? "Summary *" : "Ringkasan Singkat *"}
            </label>
            <textarea
              id="submit-summary"
              name="summary"
              required
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder={isEn ? "Tactical guidelines for organizing clean code architecture..." : "Pedoman taktis untuk menyusun struktur kode terorganisir..."}
              className="w-full p-2.5 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground resize-y leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label htmlFor="submit-slug" className="block text-xs font-medium text-foreground mb-1.5">
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
              <label htmlFor="submit-category" className="block text-xs font-medium text-foreground mb-1.5">
                {isEn ? "Category" : "Kategori"}
              </label>
              <select
                id="submit-category"
                name="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground cursor-pointer"
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
              <label htmlFor="submit-tags" className="block text-xs font-medium text-foreground mb-1.5">
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
              {isEn ? "2. SKILL.md Content" : "2. Isi Lengkap SKILL.md"} *
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
            {previewTab === "edit" ? (
              <textarea
                id="submit-content"
                name="content"
                required
                rows={13}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="# Judul Skill&#10;&#10;Instruksi detail agen AI, aturan kerja, dan panduan eksekusi..."
                className="w-full p-3.5 rounded-[6px] border border-border bg-background text-foreground text-xs font-mono focus:outline-2 focus:outline-foreground leading-relaxed resize-y"
              />
            ) : (
              <div className="p-4 rounded-[6px] border border-border bg-background max-h-96 overflow-y-auto">
                <ClientMarkdownRenderer content={content || "*(Belum ada konten)*"} />
              </div>
            )}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-border bg-surface space-y-4 shadow-2xs">
          <SkillFilesManager files={files} onChange={setFiles} maxFiles={10} />
        </div>

        <div className="p-5 rounded-xl border border-border bg-surface space-y-4 shadow-2xs">
          <h3 className="text-sm font-semibold text-foreground pb-2 border-b border-border/80">
            {isEn ? "4. Author & License Attribution" : "4. Pengarang & Lisensi"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="submit-author-name" className="block text-xs font-medium text-foreground mb-1.5">
                Nama Pengarang / Tim
              </label>
              <input
                id="submit-author-name"
                name="authorName"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="mis. Antigravity Core Team"
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground"
              />
            </div>

            <div>
              <label htmlFor="submit-author-url" className="block text-xs font-medium text-foreground mb-1.5">
                URL Profil Pengarang
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
              <label htmlFor="submit-license" className="block text-xs font-medium text-foreground mb-1.5">
                Lisensi
              </label>
              <input
                id="submit-license"
                name="license"
                type="text"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                placeholder="MIT, Apache-2.0, dll."
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href={`/${locale}/skills`}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground text-xs font-medium transition-colors"
          >
            <span>{isEn ? "Cancel" : "Batal"}</span>
          </Link>
          <button
            type="submit"
            disabled={isPending || !title.trim() || !content.trim()}
            className="inline-flex items-center gap-2 h-9 px-5 rounded-[6px] bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <span>{isPending ? "Mengirim..." : isEn ? "Submit Skill" : "Kirim Skill"}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
