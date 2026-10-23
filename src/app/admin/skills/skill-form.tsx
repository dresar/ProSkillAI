"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, RefreshCw, AlertCircle, Eye, Code, Sparkles, Loader2 } from "lucide-react";
import { createSkillAction, updateSkillAction } from "./actions";
import { resyncSkillAction } from "../github-import/actions";
import { ClientMarkdownRenderer } from "@/components/client-markdown-renderer";
import { ImageUploader } from "@/components/admin/image-uploader";
import { GitHubImportPanel } from "@/components/admin/github-import-panel";
import type { GitHubFormCandidate, GitHubFormRepo } from "./github-actions";
import type { Skill, Category } from "@/db/schema";

interface SkillFormProps {
  initialSkill?: Skill;
  categories: Category[];
}

export function SkillForm({ initialSkill, categories }: SkillFormProps) {
  const isEditing = Boolean(initialSkill);
  const actionFn = isEditing
    ? updateSkillAction.bind(null, initialSkill!.id)
    : createSkillAction;

  const [state, formAction, isPending] = useActionState(actionFn, null);

  const [activeTab, setActiveTab] = React.useState<"id" | "en">("id");
  const [previewMode, setPreviewMode] = React.useState(false);
  const [isResyncing, setIsResyncing] = React.useState(false);
  const [resyncSuccess, setResyncSuccess] = React.useState(false);

  const [slug, setSlug] = React.useState(initialSkill?.slug || "");
  const [titleId, setTitleId] = React.useState(initialSkill?.titleId || "");
  const [titleEn, setTitleEn] = React.useState(initialSkill?.titleEn || "");
  const [summaryId, setSummaryId] = React.useState(initialSkill?.summaryId || "");
  const [summaryEn, setSummaryEn] = React.useState(initialSkill?.summaryEn || "");
  const [contentId, setContentId] = React.useState(initialSkill?.contentId || "");
  const [contentEn, setContentEn] = React.useState(initialSkill?.contentEn || "");
  const [previewType, setPreviewType] = React.useState<string>(initialSkill?.previewType || "none");
  const [previewHtml, setPreviewHtml] = React.useState(initialSkill?.previewHtml || "");
  const [previewImageUrl, setPreviewImageUrl] = React.useState(initialSkill?.previewImageUrl || "");
  const [previewVideoUrl, setPreviewVideoUrl] = React.useState(initialSkill?.previewVideoUrl || "");
  const [images, setImages] = React.useState<string[]>(() => {
    const gallery = Array.isArray(initialSkill?.images) ? (initialSkill.images as string[]) : [];
    if (gallery.length > 0) return gallery;
    return initialSkill?.previewImageUrl ? [initialSkill.previewImageUrl] : [];
  });
  const [status, setStatus] = React.useState(initialSkill?.status || "draft");
  const [categoryId, setCategoryId] = React.useState(initialSkill?.categoryId || "");
  const [sourceType, setSourceType] = React.useState(initialSkill?.sourceType || "original");
  const [repoUrl, setRepoUrl] = React.useState(initialSkill?.repoUrl || "");
  const [filePath, setFilePath] = React.useState(initialSkill?.filePath || "");
  const [branch, setBranch] = React.useState(initialSkill?.branch || "");
  const [license, setLicense] = React.useState(initialSkill?.license || "MIT");
  const [authorName, setAuthorName] = React.useState(initialSkill?.authorName || "");
  const [authorUrl, setAuthorUrl] = React.useState(initialSkill?.authorUrl || "");
  const [attribution, setAttribution] = React.useState(initialSkill?.attribution || "");
  const [tagsInput, setTagsInput] = React.useState(() => {
    const tags = Array.isArray(initialSkill?.tags) ? (initialSkill.tags as string[]) : [];
    return tags.join(", ");
  });
  const [translatingField, setTranslatingField] = React.useState<string | null>(null);

  const handleTranslate = async (field: "title" | "summary" | "content" | "all") => {
    try {
      setTranslatingField(field);

      if (field === "title" || field === "all") {
        if (titleId.trim()) {
          const res = await fetch("/api/ai/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: titleId.trim(), type: "title" }),
          });
          const data = await res.json();
          if (data?.success && data?.translatedText) {
            setTitleEn(data.translatedText);
          }
        }
      }

      if (field === "summary" || field === "all") {
        if (summaryId.trim()) {
          const res = await fetch("/api/ai/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: summaryId.trim(), type: "description" }),
          });
          const data = await res.json();
          if (data?.success && data?.translatedText) {
            setSummaryEn(data.translatedText);
          }
        }
      }

      if (field === "content" || field === "all") {
        if (contentId.trim()) {
          const res = await fetch("/api/ai/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: contentId.trim(), type: "content" }),
          });
          const data = await res.json();
          if (data?.success && data?.translatedText) {
            setContentEn(data.translatedText);
          }
        }
      }

      if (field === "all") {
        setActiveTab("en");
      }
    } catch {
    } finally {
      setTranslatingField(null);
    }
  };

  const handleImagesChange = (urls: string[]) => {
    setImages(urls);
    if (urls[0]) setPreviewImageUrl(urls[0]);
    if (urls.length > 0 && previewType === "none") setPreviewType("image");
  };

  const handleGitHubSelect = (candidate: GitHubFormCandidate, repo: GitHubFormRepo) => {
    setTitleId(candidate.name);
    setTitleEn(candidate.name);
    setSummaryId(candidate.description);
    setSummaryEn(candidate.description);
    setContentId(candidate.content);
    setContentEn(candidate.content);
    setSlug(
      candidate.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    );
    setSourceType("github");
    setRepoUrl(repo.htmlUrl);
    setFilePath(candidate.path);
    setBranch(repo.defaultBranch);
    setLicense(candidate.licenseSpdx || "MIT");
    setAuthorName(repo.owner);
    setAuthorUrl(`https://github.com/${repo.owner}`);
  };

  const tags = tagsInput
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const handleTitleChange = (val: string, lang: "id" | "en") => {
    if (lang === "id") {
      setTitleId(val);
      if (!isEditing && !slug) {
        setSlug(
          val
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        );
      }
    } else {
      setTitleEn(val);
    }
  };

  const handleResync = async () => {
    if (!initialSkill) return;
    setIsResyncing(true);
    setResyncSuccess(false);
    try {
      await resyncSkillAction(initialSkill.id);
      setResyncSuccess(true);
      setTimeout(() => setResyncSuccess(false), 3000);
    } finally {
      setIsResyncing(false);
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <Link
          href="/admin/skills"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-foreground"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Skills</span>
        </Link>

        <div className="flex items-center gap-2">
          {initialSkill?.sourceType === "github" && (
            <button
              type="button"
              disabled={isResyncing}
              onClick={handleResync}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded text-xs border border-neutral-300 dark:border-neutral-700 bg-surface hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResyncing ? "animate-spin" : ""}`} />
              <span>{resyncSuccess ? "Tersinkron!" : "Sinkron Ulang GitHub"}</span>
            </button>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 h-8 px-4 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isPending ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Simpan Skill"}</span>
          </button>
        </div>
      </div>

      {state?.error && (
        <div
          role="alert"
          className="p-3 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-foreground text-xs flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-foreground" />
          <span>{state.error}</span>
        </div>
      )}

      {state?.success && (
        <div className="p-3 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-foreground text-xs">
          Perubahan berhasil disimpan.
        </div>
      )}

      <GitHubImportPanel onSelect={handleGitHubSelect} />

      <input type="hidden" name="tagsJson" value={JSON.stringify(tags)} />
      <input type="hidden" name="previewHtml" value={previewHtml} />
      <input type="hidden" name="previewImageUrl" value={images[0] || previewImageUrl} />
      <input type="hidden" name="previewVideoUrl" value={previewVideoUrl} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded border border-neutral-200 dark:border-neutral-800 p-0.5 bg-neutral-50 dark:bg-neutral-900">
                <button
                  type="button"
                  onClick={() => setActiveTab("id")}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    activeTab === "id"
                      ? "bg-foreground text-background font-medium"
                      : "text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-800"
                  }`}
                >
                  Bahasa Indonesia
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("en")}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    activeTab === "en"
                      ? "bg-foreground text-background font-medium"
                      : "text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-800"
                  }`}
                >
                  English
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleTranslate("all")}
                disabled={(!titleId.trim() && !summaryId.trim() && !contentId.trim()) || translatingField !== null}
                className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[5px] border border-border bg-surface hover:bg-muted text-[11px] font-medium text-foreground transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                {translatingField === "all" ? (
                  <Loader2 className="w-3 h-3 animate-spin text-foreground" />
                ) : (
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                )}
                <span>Auto-Translate ke EN (AI)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-foreground"
            >
              {previewMode ? <Code className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{previewMode ? "Mode Editor" : "Pratinjau Markdown"}</span>
            </button>
          </div>

          {activeTab === "id" ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="titleId" className="block text-xs font-semibold text-foreground">
                  Judul Skill (ID) *
                </label>
                <input
                  id="titleId"
                  name="titleId"
                  type="text"
                  required
                  value={titleId}
                  onChange={(e) => handleTitleChange(e.target.value, "id")}
                  className="w-full h-8 px-2.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground focus:outline-2 focus:outline-foreground"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="summaryId" className="block text-xs font-semibold text-foreground">
                  Ringkasan Singkat (ID) *
                </label>
                <textarea
                  id="summaryId"
                  name="summaryId"
                  rows={2}
                  required
                  value={summaryId}
                  onChange={(e) => setSummaryId(e.target.value)}
                  className="w-full p-2.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground focus:outline-2 focus:outline-foreground"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="contentId" className="block text-xs font-semibold text-foreground">
                  Isi SKILL.md (ID) *
                </label>
                {previewMode ? (
                  <div className="p-4 rounded border border-neutral-200 dark:border-neutral-800 bg-surface min-h-[300px]">
                    <ClientMarkdownRenderer content={contentId} />
                  </div>
                ) : (
                  <textarea
                    id="contentId"
                    name="contentId"
                    rows={16}
                    required
                    value={contentId}
                    onChange={(e) => setContentId(e.target.value)}
                    className="w-full p-3 font-mono text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground leading-relaxed focus:outline-2 focus:outline-foreground"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="titleEn" className="block text-xs font-semibold text-foreground">
                    Skill Title (EN) *
                  </label>
                  <button
                    type="button"
                    onClick={() => handleTranslate("title")}
                    disabled={!titleId.trim() || translatingField !== null}
                    className="inline-flex items-center gap-1 h-5 px-1.5 rounded-[4px] border border-border bg-surface hover:bg-muted text-[10px] font-medium text-foreground transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
                  >
                    {translatingField === "title" || translatingField === "all" ? (
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                    )}
                    <span>Auto AI</span>
                  </button>
                </div>
                <input
                  id="titleEn"
                  name="titleEn"
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => handleTitleChange(e.target.value, "en")}
                  className="w-full h-8 px-2.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground focus:outline-2 focus:outline-foreground"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="summaryEn" className="block text-xs font-semibold text-foreground">
                    Summary (EN) *
                  </label>
                  <button
                    type="button"
                    onClick={() => handleTranslate("summary")}
                    disabled={!summaryId.trim() || translatingField !== null}
                    className="inline-flex items-center gap-1 h-5 px-1.5 rounded-[4px] border border-border bg-surface hover:bg-muted text-[10px] font-medium text-foreground transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
                  >
                    {translatingField === "summary" || translatingField === "all" ? (
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                    )}
                    <span>Auto AI</span>
                  </button>
                </div>
                <textarea
                  id="summaryEn"
                  name="summaryEn"
                  rows={2}
                  required
                  value={summaryEn}
                  onChange={(e) => setSummaryEn(e.target.value)}
                  className="w-full p-2.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground focus:outline-2 focus:outline-foreground"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="contentEn" className="block text-xs font-semibold text-foreground">
                    SKILL.md Content (EN) *
                  </label>
                  <button
                    type="button"
                    onClick={() => handleTranslate("content")}
                    disabled={!contentId.trim() || translatingField !== null}
                    className="inline-flex items-center gap-1 h-5 px-1.5 rounded-[4px] border border-border bg-surface hover:bg-muted text-[10px] font-medium text-foreground transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
                  >
                    {translatingField === "content" || translatingField === "all" ? (
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                    )}
                    <span>Auto AI</span>
                  </button>
                </div>
                {previewMode ? (
                  <div className="p-4 rounded border border-neutral-200 dark:border-neutral-800 bg-surface min-h-[300px]">
                    <ClientMarkdownRenderer content={contentEn} />
                  </div>
                ) : (
                  <textarea
                    id="contentEn"
                    name="contentEn"
                    rows={16}
                    required
                    value={contentEn}
                    onChange={(e) => setContentEn(e.target.value)}
                    className="w-full p-3 font-mono text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground leading-relaxed focus:outline-2 focus:outline-foreground"
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === "id" ? (
            <>
              <input type="hidden" name="titleEn" value={titleEn} />
              <input type="hidden" name="summaryEn" value={summaryEn} />
              <input type="hidden" name="contentEn" value={contentEn} />
            </>
          ) : (
            <>
              <input type="hidden" name="titleId" value={titleId} />
              <input type="hidden" name="summaryId" value={summaryId} />
              <input type="hidden" name="contentId" value={contentId} />
            </>
          )}
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface space-y-3 text-xs">
            <h3 className="font-semibold text-foreground tracking-tight pb-2 border-b border-neutral-200 dark:border-neutral-800">
              Galeri Gambar (maks 5)
            </h3>
            <ImageUploader
              value={images}
              onChange={handleImagesChange}
              folder="skills"
              slug={slug}
              max={5}
            />
            {(images[0] || previewImageUrl) && (
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Pratinjau Kartu
                </span>
                <div className="rounded-lg border border-border overflow-hidden bg-surface">
                  <div className="relative aspect-video bg-muted">
                    <Image
                      src={images[0] || previewImageUrl}
                      alt={titleId || "Pratinjau skill"}
                      fill
                      unoptimized
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2.5">
                    <div className="text-xs font-semibold text-foreground truncate">
                      {titleId || "Judul skill"}
                    </div>
                    <div className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                      {summaryId || "Ringkasan skill akan tampil di sini."}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface space-y-4 text-xs">
            <h3 className="font-semibold text-foreground tracking-tight pb-2 border-b border-neutral-200 dark:border-neutral-800">
              Pengaturan Publikasi
            </h3>

            <div className="space-y-1">
              <label htmlFor="slug" className="block font-medium text-neutral-700 dark:text-neutral-300">
                Slug URL *
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full h-8 px-2.5 font-mono text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="status" className="block font-medium text-neutral-700 dark:text-neutral-300">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-8 px-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground cursor-pointer"
              >
                <option value="draft">Draft (Disembunyikan)</option>
                <option value="published">Published (Terbit Publik)</option>
                <option value="archived">Archived (Arsip)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="categoryId" className="block font-medium text-neutral-700 dark:text-neutral-300">
                Kategori
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-8 px-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground cursor-pointer"
              >
                <option value="">Tanpa Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameId} / {c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="previewType" className="block font-medium text-neutral-700 dark:text-neutral-300">
                Tipe Pratinjau Visual
              </label>
              <select
                id="previewType"
                name="previewType"
                value={previewType}
                onChange={(e) => setPreviewType(e.target.value)}
                className="w-full h-8 px-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground cursor-pointer"
              >
                <option value="none">Tidak Ada (Teks Murni)</option>
                <option value="html">Potongan HTML/CSS Statis</option>
                <option value="image">Gambar Thumbnail</option>
                <option value="video">Video (YouTube / Loom / MP4)</option>
                <option value="markdown">Markdown Terrender</option>
                <option value="tokens">Token Desain Terstruktur</option>
              </select>
            </div>

            {previewType === "html" && (
              <div className="space-y-1">
                <label htmlFor="previewHtml" className="block font-medium text-neutral-700 dark:text-neutral-300">
                  HTML & CSS Pratinjau
                </label>
                <textarea
                  id="previewHtml"
                  rows={4}
                  value={previewHtml}
                  onChange={(e) => setPreviewHtml(e.target.value)}
                  placeholder="<!DOCTYPE html><html>...</html>"
                  className="w-full p-2 font-mono text-[11px] rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
                />
              </div>
            )}

            {previewType === "image" && (
              <div className="space-y-1">
                <label htmlFor="previewImageUrl" className="block font-medium text-neutral-700 dark:text-neutral-300">
                  URL Gambar
                </label>
                <input
                  id="previewImageUrl"
                  type="url"
                  value={previewImageUrl}
                  onChange={(e) => setPreviewImageUrl(e.target.value)}
                  placeholder="https://cdn.jsdelivr.net/gh/owner/repo@main/public/img.png"
                  className="w-full h-8 px-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
                />
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  Didukung aset GitHub CDN via jsDelivr:
                  <span className="font-mono"> cdn.jsdelivr.net/gh/owner/repo@main/...</span>
                </p>
              </div>
            )}

            {previewType === "video" && (
              <div className="space-y-1">
                <label htmlFor="previewVideoUrl" className="block font-medium text-neutral-700 dark:text-neutral-300">
                  URL Video
                </label>
                <input
                  id="previewVideoUrl"
                  type="url"
                  value={previewVideoUrl}
                  onChange={(e) => setPreviewVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... atau https://.../demo.mp4"
                  className="w-full h-8 px-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
                />
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  Mendukung embed YouTube, Loom, atau file MP4 langsung (rasio 16:9).
                </p>
              </div>
            )}
          </div>

          <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface space-y-3 text-xs">
            <h3 className="font-semibold text-foreground tracking-tight pb-2 border-b border-neutral-200 dark:border-neutral-800">
              Sumber & Atribusi
            </h3>

            <div className="space-y-1">
              <label htmlFor="sourceType" className="block font-medium text-neutral-700 dark:text-neutral-300">
                Tipe Sumber
              </label>
              <select
                id="sourceType"
                name="sourceType"
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
                className="w-full h-8 px-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
              >
                <option value="original">Orisinal ProSkillAI</option>
                <option value="github">Diimpor dari GitHub</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="authorName" className="block font-medium text-neutral-700 dark:text-neutral-300">
                Nama Pembuat
              </label>
              <input
                id="authorName"
                name="authorName"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full h-8 px-2.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="authorUrl" className="block font-medium text-neutral-700 dark:text-neutral-300">
                URL Profil Pembuat
              </label>
              <input
                id="authorUrl"
                name="authorUrl"
                type="url"
                value={authorUrl}
                onChange={(e) => setAuthorUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full h-8 px-2.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="repoUrl" className="block font-medium text-neutral-700 dark:text-neutral-300">
                URL Repository GitHub
              </label>
              <input
                id="repoUrl"
                name="repoUrl"
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full h-8 px-2.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <label htmlFor="filePath" className="block font-medium text-neutral-700 dark:text-neutral-300">
                  Path File SKILL.md
                </label>
                <input
                  id="filePath"
                  name="filePath"
                  type="text"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  placeholder="skills/my-skill/SKILL.md"
                  className="w-full h-8 px-2.5 font-mono text-[11px] rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="branch" className="block font-medium text-neutral-700 dark:text-neutral-300">
                  Branch
                </label>
                <input
                  id="branch"
                  name="branch"
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="main"
                  className="w-full h-8 px-2.5 font-mono text-[11px] rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="license" className="block font-medium text-neutral-700 dark:text-neutral-300">
                Lisensi (SPDX)
              </label>
              <input
                id="license"
                name="license"
                type="text"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="w-full h-8 px-2.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="attribution" className="block font-medium text-neutral-700 dark:text-neutral-300">
                Atribusi
              </label>
              <textarea
                id="attribution"
                name="attribution"
                rows={2}
                value={attribution}
                onChange={(e) => setAttribution(e.target.value)}
                placeholder="Kredit atau catatan atribusi sumber."
                className="w-full p-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="tags" className="block font-medium text-neutral-700 dark:text-neutral-300">
                Tag (pisahkan dengan koma)
              </label>
              <input
                id="tags"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="design, frontend, accessibility"
                className="w-full h-8 px-2.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
