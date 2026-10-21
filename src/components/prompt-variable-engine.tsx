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
        vars.push({
          name: varName,
          labelId: varName.replace(/[_-]/g, " "),
          labelEn: varName.replace(/[_-]/g, " "),
          placeholder: `Masukkan ${varName}`,
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
            {locale === "en" ? "Version:" : "Versi:"}
          </span>
          <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted">
            <button
              type="button"
              onClick={() => setSelectedLang("id")}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                selectedLang === "id"
                  ? "bg-foreground text-background font-medium"
                  : "text-foreground hover:bg-surface-hover"
              }`}
            >
              Indonesia
            </button>
            <button
              type="button"
              onClick={() => setSelectedLang("en")}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                selectedLang === "en"
                  ? "bg-foreground text-background font-medium"
                  : "text-foreground hover:bg-surface-hover"
              }`}
            >
              English
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-95 cursor-pointer"
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

      {discoveredVariables.length > 0 && (
        <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
          <h4 className="text-xs font-semibold text-foreground tracking-tight">
            {locale === "en" ? "Fill Variables" : "Isi Variabel"}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {discoveredVariables.map((v) => (
              <div key={v.name} className="space-y-1">
                <label
                  htmlFor={`var-${v.name}`}
                  className="block text-xs font-medium text-muted-foreground capitalize"
                >
                  {locale === "en" ? v.labelEn : v.labelId}
                  <span className="font-mono text-[11px] text-muted-foreground ml-1">
                    ({`{{${v.name}}}`})
                  </span>
                </label>
                <input
                  id={`var-${v.name}`}
                  type="text"
                  value={formValues[v.name] || ""}
                  placeholder={v.placeholder || `{{${v.name}}}`}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, [v.name]: e.target.value }))
                  }
                  className="w-full h-8 px-2.5 text-xs rounded-lg border border-border bg-surface text-foreground focus:outline-2 focus:outline-foreground"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            {locale === "en" ? "Rendered Prompt Preview" : "Pratinjau Prompt Hasil"}
          </span>
        </div>
        <pre className="p-4 rounded-xl border border-border bg-muted/40 text-foreground font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[500px]">
          {resolvedPrompt}
        </pre>
      </div>
    </div>
  );
}
