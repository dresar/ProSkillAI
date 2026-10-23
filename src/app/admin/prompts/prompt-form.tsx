"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, Plus, Trash2, Eye, Code, ExternalLink, Sparkles, Loader2 } from "lucide-react";
import { createPromptAction, updatePromptAction } from "./actions";
import { ImageUploader } from "@/components/admin/image-uploader";
import { PromptPreviewDialog } from "@/components/admin/prompt-preview-dialog";
import type { Prompt, Category } from "@/db/schema";

interface VariableItem {
  name: string;
  labelId: string;
  labelEn: string;
  defaultValue: string;
  placeholder: string;
}

interface SkillOption {
  id: string;
  titleId: string;
  titleEn: string;
  slug: string;
}

interface PromptFormProps {
  initialPrompt?: Prompt;
  categories: Category[];
  skillOptions: SkillOption[];
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function resolveWithDefaults(template: string, variables: VariableItem[]): string {
  let result = template;
  for (const variable of variables) {
    const value = variable.defaultValue?.trim();
    if (!value) continue;
    result = result.replace(
      new RegExp(`\\{\\{\\s*${escapeRegex(variable.name)}\\s*\\}\\}`, "g"),
      value
    );
  }
  return result;
}

export function PromptForm({ initialPrompt, categories, skillOptions }: PromptFormProps) {
  const isEditing = Boolean(initialPrompt);
  const actionFn = isEditing
    ? updatePromptAction.bind(null, initialPrompt!.id)
    : createPromptAction;

  const [state, formAction, isPending] = useActionState(actionFn, null);

  const [activeTab, setActiveTab] = React.useState<"id" | "en">("id");
  const [slug, setSlug] = React.useState(initialPrompt?.slug || "");
  const [titleId, setTitleId] = React.useState(initialPrompt?.titleId || "");
  const [titleEn, setTitleEn] = React.useState(initialPrompt?.titleEn || "");
  const [descriptionId, setDescriptionId] = React.useState(initialPrompt?.descriptionId || "");
  const [descriptionEn, setDescriptionEn] = React.useState(initialPrompt?.descriptionEn || "");
  const [contentId, setContentId] = React.useState(initialPrompt?.contentId || "");
  const [contentEn, setContentEn] = React.useState(initialPrompt?.contentEn || "");
  const [previewMode, setPreviewMode] = React.useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = React.useState(false);
  const [images, setImages] = React.useState<string[]>(() =>
    Array.isArray(initialPrompt?.images) ? (initialPrompt.images as string[]) : []
  );
  const [tagsInput, setTagsInput] = React.useState(() =>
    Array.isArray(initialPrompt?.tags) ? (initialPrompt.tags as string[]).join(", ") : ""
  );
  const [relatedSkillId, setRelatedSkillId] = React.useState(initialPrompt?.relatedSkillId || "");
  const [status, setStatus] = React.useState(initialPrompt?.status || "draft");
  const [categoryId, setCategoryId] = React.useState(initialPrompt?.categoryId || "");

  const tags = tagsInput
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const relatedSkill = skillOptions.find((option) => option.id === relatedSkillId) || null;

  const [variables, setVariables] = React.useState<VariableItem[]>(() => {
    if (Array.isArray(initialPrompt?.variables)) {
      return initialPrompt.variables as unknown as VariableItem[];
    }
    return [];
  });

  const [translatingField, setTranslatingField] = React.useState<string | null>(null);

  const handleTranslate = async (field: "title" | "description" | "content" | "all") => {
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

      if (field === "description" || field === "all") {
        if (descriptionId.trim()) {
          const res = await fetch("/api/ai/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: descriptionId.trim(), type: "description" }),
          });
          const data = await res.json();
          if (data?.success && data?.translatedText) {
            setDescriptionEn(data.translatedText);
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

  const addVariable = () => {
    setVariables((prev) => [
      ...prev,
      {
        name: `var_${prev.length + 1}`,
        labelId: "Label Variabel",
        labelEn: "Variable Label",
        defaultValue: "",
        placeholder: "",
      },
    ]);
  };

  const removeVariable = (index: number) => {
    setVariables((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariable = (index: number, field: keyof VariableItem, value: string) => {
    setVariables((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <Link
          href="/admin/prompts"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-foreground"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Prompts</span>
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          {isEditing && (
            <Link
              href={`/id/prompts/${slug}`}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded text-xs border border-neutral-300 dark:border-neutral-700 bg-surface hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>URL Publik</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setPreviewDialogOpen(true)}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded text-xs border border-neutral-300 dark:border-neutral-700 bg-surface hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Pratinjau Prompt</span>
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 h-8 px-4 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isPending ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Simpan Prompt"}</span>
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

      <input type="hidden" name="variablesJson" value={JSON.stringify(variables)} />
      <input type="hidden" name="tagsJson" value={JSON.stringify(tags)} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 flex-wrap">
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
                disabled={(!titleId.trim() && !descriptionId.trim() && !contentId.trim()) || translatingField !== null}
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
              <span>{previewMode ? "Mode Editor" : "Pratinjau"}</span>
            </button>
          </div>

          {activeTab === "id" ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="titleId" className="block text-xs font-semibold text-foreground">
                  Judul Prompt (ID) *
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
                <label htmlFor="descriptionId" className="block text-xs font-semibold text-foreground">
                  Deskripsi Prompt (ID) *
                </label>
                <textarea
                  id="descriptionId"
                  name="descriptionId"
                  rows={2}
                  required
                  value={descriptionId}
                  onChange={(e) => setDescriptionId(e.target.value)}
                  className="w-full p-2.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground focus:outline-2 focus:outline-foreground"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="contentId" className="block text-xs font-semibold text-foreground">
                  Isi Teks Mentah Prompt (ID) *
                  <span className="font-normal text-neutral-400 ml-2">
                    (Gunakan format {`{{nama_variabel}}`})
                  </span>
                </label>
                <div className={previewMode ? "hidden" : ""}>
                  <textarea
                    id="contentId"
                    name="contentId"
                    rows={14}
                    required
                    value={contentId}
                    onChange={(e) => setContentId(e.target.value)}
                    className="w-full p-3 font-mono text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground leading-relaxed focus:outline-2 focus:outline-foreground"
                  />
                </div>
                {previewMode && (
                  <pre className="w-full min-h-[200px] p-3 rounded border border-neutral-200 dark:border-neutral-800 bg-surface text-foreground font-mono text-xs whitespace-pre-wrap leading-relaxed">
                    {resolveWithDefaults(contentId, variables)}
                  </pre>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="titleEn" className="block text-xs font-semibold text-foreground">
                    Prompt Title (EN) *
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
                  <label htmlFor="descriptionEn" className="block text-xs font-semibold text-foreground">
                    Description (EN) *
                  </label>
                  <button
                    type="button"
                    onClick={() => handleTranslate("description")}
                    disabled={!descriptionId.trim() || translatingField !== null}
                    className="inline-flex items-center gap-1 h-5 px-1.5 rounded-[4px] border border-border bg-surface hover:bg-muted text-[10px] font-medium text-foreground transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
                  >
                    {translatingField === "description" || translatingField === "all" ? (
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                    )}
                    <span>Auto AI</span>
                  </button>
                </div>
                <textarea
                  id="descriptionEn"
                  name="descriptionEn"
                  rows={2}
                  required
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  className="w-full p-2.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground focus:outline-2 focus:outline-foreground"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="contentEn" className="block text-xs font-semibold text-foreground">
                    Raw Prompt Content (EN) *
                    <span className="font-normal text-neutral-400 ml-2">
                      (Use format {`{{variable_name}}`})
                    </span>
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
                <div className={previewMode ? "hidden" : ""}>
                  <textarea
                    id="contentEn"
                    name="contentEn"
                    rows={14}
                    required
                    value={contentEn}
                    onChange={(e) => setContentEn(e.target.value)}
                    className="w-full p-3 font-mono text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground leading-relaxed focus:outline-2 focus:outline-foreground"
                  />
                </div>
                {previewMode && (
                  <pre className="w-full min-h-[200px] p-3 rounded border border-neutral-200 dark:border-neutral-800 bg-surface text-foreground font-mono text-xs whitespace-pre-wrap leading-relaxed">
                    {resolveWithDefaults(contentEn, variables)}
                  </pre>
                )}
              </div>
            </div>
          )}

          {activeTab === "id" ? (
            <>
              <input type="hidden" name="titleEn" value={titleEn} />
              <input type="hidden" name="descriptionEn" value={descriptionEn} />
              <input type="hidden" name="contentEn" value={contentEn} />
            </>
          ) : (
            <>
              <input type="hidden" name="titleId" value={titleId} />
              <input type="hidden" name="descriptionId" value={descriptionId} />
              <input type="hidden" name="contentId" value={contentId} />
            </>
          )}

          <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-foreground">
                Variabel Prompt Dinamis
              </h3>
              <button
                type="button"
                onClick={addVariable}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Variabel</span>
              </button>
            </div>

            {variables.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">
                Belum ada variabel yang didefinisikan. Tambahkan variabel untuk mempermudah pengguna mengisi placeholder kurung kurawal ganda.
              </p>
            ) : (
              <div className="space-y-3">
                {variables.map((v, i) => (
                  <div
                    key={i}
                    className="p-3 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-xs space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[11px] font-semibold text-foreground">
                        #{i + 1}: {`{{${v.name}}}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeVariable(i)}
                        className="text-neutral-400 hover:text-foreground"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Nama variabel (e.g. topic)"
                        value={v.name}
                        onChange={(e) => updateVariable(i, "name", e.target.value)}
                        className="h-7 px-2 font-mono text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
                      />
                      <input
                        type="text"
                        placeholder="Nilai Default"
                        value={v.defaultValue}
                        onChange={(e) => updateVariable(i, "defaultValue", e.target.value)}
                        className="h-7 px-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
                      />
                      <input
                        type="text"
                        placeholder="Label Indonesia"
                        value={v.labelId}
                        onChange={(e) => updateVariable(i, "labelId", e.target.value)}
                        className="h-7 px-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
                      />
                      <input
                        type="text"
                        placeholder="Label English"
                        value={v.labelEn}
                        onChange={(e) => updateVariable(i, "labelEn", e.target.value)}
                        className="h-7 px-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface space-y-3 text-xs">
            <h3 className="font-semibold text-foreground tracking-tight pb-2 border-b border-neutral-200 dark:border-neutral-800">
              Galeri Gambar (maks 5)
            </h3>
            <ImageUploader
              value={images}
              onChange={setImages}
              folder="prompts"
              slug={slug}
              max={5}
            />
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
              <label htmlFor="tags" className="block font-medium text-neutral-700 dark:text-neutral-300">
                Tag (pisahkan dengan koma)
              </label>
              <input
                id="tags"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="marketing, copywriting, seo"
                className="w-full h-8 px-2.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="relatedSkillId" className="block font-medium text-neutral-700 dark:text-neutral-300">
                Skill Terkait
              </label>
              <select
                id="relatedSkillId"
                name="relatedSkillId"
                value={relatedSkillId}
                onChange={(e) => setRelatedSkillId(e.target.value)}
                className="w-full h-8 px-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground cursor-pointer"
              >
                <option value="">Tanpa Skill Terkait</option>
                {skillOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.titleId} / {option.titleEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface space-y-2 text-xs">
            <h3 className="font-semibold text-foreground tracking-tight pb-2 border-b border-neutral-200 dark:border-neutral-800">
              Tautan &amp; URL
            </h3>
            <div className="flex items-center justify-between gap-2">
              <span className="text-neutral-500 dark:text-neutral-400">URL Publik</span>
              {isEditing ? (
                <Link
                  href={`/id/prompts/${slug}`}
                  target="_blank"
                  className="font-mono text-[11px] text-foreground hover:underline truncate max-w-[55%]"
                >
                  /id/prompts/{slug}
                </Link>
              ) : (
                <span className="font-mono text-[11px] text-neutral-400 truncate max-w-[55%]">
                  /id/prompts/{slug || "slug"}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-neutral-500 dark:text-neutral-400">Skill Terkait</span>
              {relatedSkill ? (
                <Link
                  href={`/id/skills/${relatedSkill.slug}`}
                  target="_blank"
                  className="font-mono text-[11px] text-foreground hover:underline truncate max-w-[55%]"
                >
                  /id/skills/{relatedSkill.slug}
                </Link>
              ) : (
                <span className="text-[11px] text-neutral-400">-</span>
              )}
            </div>
            {images.length > 0 && (
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  CDN Gambar
                </span>
                {images.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400 truncate"
                  >
                    {index + 1}. {url}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <PromptPreviewDialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        contentId={contentId}
        contentEn={contentEn}
        variables={variables}
        initialLang={activeTab}
      />
    </form>
  );
}
