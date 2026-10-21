"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, Plus, Trash2 } from "lucide-react";
import { createPromptAction, updatePromptAction } from "./actions";
import type { Prompt, Category } from "@/db/schema";

interface VariableItem {
  name: string;
  labelId: string;
  labelEn: string;
  defaultValue: string;
  placeholder: string;
}

interface PromptFormProps {
  initialPrompt?: Prompt;
  categories: Category[];
}

export function PromptForm({ initialPrompt, categories }: PromptFormProps) {
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

  const [variables, setVariables] = React.useState<VariableItem[]>(() => {
    if (Array.isArray(initialPrompt?.variables)) {
      return initialPrompt.variables as unknown as VariableItem[];
    }
    return [];
  });

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

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 h-8 px-4 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isPending ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Terbitkan Prompt"}</span>
        </button>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
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
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="titleEn" className="block text-xs font-semibold text-foreground">
                  Prompt Title (EN) *
                </label>
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
                <label htmlFor="descriptionEn" className="block text-xs font-semibold text-foreground">
                  Description (EN) *
                </label>
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
                <label htmlFor="contentEn" className="block text-xs font-semibold text-foreground">
                  Raw Prompt Content (EN) *
                  <span className="font-normal text-neutral-400 ml-2">
                    (Use format {`{{variable_name}}`})
                  </span>
                </label>
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
                defaultValue={initialPrompt?.status || "draft"}
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
                defaultValue={initialPrompt?.categoryId || ""}
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
          </div>
        </div>
      </div>
    </form>
  );
}
