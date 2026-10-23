"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import type { Prompt } from "@/db/schema";
import { trackPromptAction } from "@/app/actions/track";

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

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatVariableLabel(name: string): string {
  return name
    .replace(/[_-]/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function PromptVariableEngine({ prompt, locale }: PromptVariableEngineProps) {
  const [selectedLang, setSelectedLang] = React.useState<"id" | "en">(
    locale === "en" ? "en" : "id"
  );
  const [copied, setCopied] = React.useState(false);

  const rawTemplate = selectedLang === "en" ? prompt.contentEn : prompt.contentId;

  const definedVariables: VariableDef[] = React.useMemo(() => {
    return Array.isArray(prompt.variables)
      ? (prompt.variables as unknown as VariableDef[])
      : [];
  }, [prompt.variables]);

  const discoveredVariables = React.useMemo(() => {
    const vars: VariableDef[] = [...definedVariables];
    const existingNames = new Set(vars.map((v) => v.name));

    const matches = rawTemplate.matchAll(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g);
    for (const match of matches) {
      const varName = match[1];
      if (!existingNames.has(varName)) {
        existingNames.add(varName);
        const formatted = formatVariableLabel(varName);
        vars.push({
          name: varName,
          labelId: formatted,
          labelEn: formatted,
        });
      }
    }
    return vars;
  }, [definedVariables, rawTemplate]);

  const [formValues, setFormValues] = React.useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const v of definedVariables) {
      if (v.defaultValue) {
        initial[v.name] = v.defaultValue;
      }
    }
    return initial;
  });

  const resolvedPrompt = React.useMemo(() => {
    let result = rawTemplate;
    for (const [key, val] of Object.entries(formValues)) {
      if (val.trim()) {
        const regex = new RegExp(`\\{\\{\\s*${escapeRegex(key)}\\s*\\}\\}`, "g");
        result = result.replace(regex, val);
      }
    }
    return result;
  }, [rawTemplate, formValues]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resolvedPrompt);
    setCopied(true);
    if (prompt.id) {
      trackPromptAction(prompt.id).catch(() => {});
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {locale === "en" ? "Language:" : "Bahasa:"}
          </span>
          <div className="inline-flex rounded-[6px] border border-border p-0.5 bg-muted/40">
            <button
              type="button"
              onClick={() => setSelectedLang("id")}
              className={`px-2.5 py-1 text-xs rounded-[5px] transition-colors cursor-pointer ${
                selectedLang === "id"
                  ? "bg-surface text-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Indonesia
            </button>
            <button
              type="button"
              onClick={() => setSelectedLang("en")}
              className={`px-2.5 py-1 text-xs rounded-[5px] transition-colors cursor-pointer ${
                selectedLang === "en"
                  ? "bg-surface text-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              English
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-xs font-medium bg-foreground text-background hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>
            {copied
              ? locale === "en"
                ? "Copied!"
                : "Tersalin!"
              : locale === "en"
              ? "Copy Prompt"
              : "Salin Prompt"}
          </span>
        </button>
      </div>

      {discoveredVariables.length > 0 && (
        <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface space-y-3.5 shadow-2xs">
          <div className="space-y-0.5">
            <h4 className="text-xs font-semibold text-foreground tracking-tight">
              {locale === "en" ? "Customize Variables" : "Sesuaikan Variabel"}
            </h4>
            <p className="text-[11px] text-muted-foreground">
              {locale === "en"
                ? "Fill in the parameters below to personalize this prompt before copying."
                : "Lengkapi parameter di bawah untuk menyesuaikan prompt sebelum disalin."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {discoveredVariables.map((v) => {
              const label =
                (selectedLang === "en" ? v.labelEn : v.labelId) ||
                (locale === "en" ? v.labelEn : v.labelId) ||
                formatVariableLabel(v.name);

              const placeholder =
                v.placeholder ||
                (selectedLang === "en" || locale === "en"
                  ? `e.g. ${label.toLowerCase()}`
                  : `mis. ${label.toLowerCase()}`);

              return (
                <div key={v.name} className="space-y-1.5">
                  <label
                    htmlFor={`var-${v.name}`}
                    className="block text-xs font-medium text-foreground tracking-tight capitalize"
                  >
                    {label}
                  </label>
                  <input
                    id={`var-${v.name}`}
                    type="text"
                    value={formValues[v.name] || ""}
                    placeholder={placeholder}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, [v.name]: e.target.value }))
                    }
                    className="w-full h-8.5 px-3 text-xs rounded-[6px] border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-foreground transition-all"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {locale === "en" ? "Ready-to-Use Prompt" : "Hasil Prompt Siap Pakai"}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {resolvedPrompt.length} {locale === "en" ? "characters" : "karakter"}
          </span>
        </div>
        <pre className="p-4 rounded-xl border border-border bg-surface text-foreground font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[500px]">
          {resolvedPrompt}
        </pre>
      </div>
    </div>
  );
}