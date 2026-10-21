"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import type { Prompt } from "@/db/schema";

interface VariableDef {
  name: string;
  labelId: string;
  labelEn: string;
  defaultValue?: string;
  placeholder?: string;
}

interface PromptVariableEngineProps {
  prompt: Prompt;
  locale: string;
}

export function PromptVariableEngine({ prompt, locale }: PromptVariableEngineProps) {
  const [selectedLang, setSelectedLang] = React.useState<"id" | "en">(
    locale === "en" ? "en" : "id"
  );
  const [copied, setCopied] = React.useState(false);

  const variables: VariableDef[] = Array.isArray(prompt.variables)
    ? (prompt.variables as unknown as VariableDef[])
    : [];

  const [formValues, setFormValues] = React.useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const v of variables) {
      initial[v.name] = v.defaultValue || "";
    }
    return initial;
  });

  const rawTemplate = selectedLang === "en" ? prompt.contentEn : prompt.contentId;

  const resolvedPrompt = React.useMemo(() => {
    let result = rawTemplate;
    for (const [key, val] of Object.entries(formValues)) {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g");
      result = result.replace(regex, val || `{{${key}}}`);
    }
    return result;
  }, [rawTemplate, formValues]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resolvedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">
            {locale === "en" ? "Version:" : "Versi:"}
          </span>
          <div className="inline-flex rounded border border-neutral-200 dark:border-neutral-800 p-0.5 bg-neutral-50 dark:bg-neutral-900">
            <button
              type="button"
              onClick={() => setSelectedLang("id")}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                selectedLang === "id"
                  ? "bg-foreground text-background font-medium"
                  : "text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-800"
              }`}
            >
              Indonesia
            </button>
            <button
              type="button"
              onClick={() => setSelectedLang("en")}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                selectedLang === "en"
                  ? "bg-foreground text-background font-medium"
                  : "text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-800"
              }`}
            >
              English
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-95 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>
            {copied
              ? locale === "en"
                ? "Copied!"
                : "Tersalin!"
              : locale === "en"
              ? "Copy Result"
              : "Salin Hasil"}
          </span>
        </button>
      </div>

      {variables.length > 0 && (
        <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-3">
          <h4 className="text-xs font-semibold text-foreground tracking-tight">
            {locale === "en" ? "Fill Variables" : "Isi Variabel"}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {variables.map((v) => (
              <div key={v.name} className="space-y-1">
                <label
                  htmlFor={`var-${v.name}`}
                  className="block text-xs font-medium text-neutral-600 dark:text-neutral-400"
                >
                  {locale === "en" ? v.labelEn : v.labelId}
                  <span className="font-mono text-[11px] text-neutral-400 ml-1">
                    ({`{{${v.name}}}`})
                  </span>
                </label>
                <input
                  id={`var-${v.name}`}
                  type="text"
                  value={formValues[v.name] || ""}
                  placeholder={v.placeholder}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, [v.name]: e.target.value }))
                  }
                  className="w-full h-8 px-2.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground focus:outline-2 focus:outline-foreground"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-neutral-500">
            {locale === "en" ? "Rendered Prompt Preview" : "Pratinjau Prompt Hasil"}
          </span>
        </div>
        <pre className="p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 text-foreground font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[500px]">
          {resolvedPrompt}
        </pre>
      </div>
    </div>
  );
}
