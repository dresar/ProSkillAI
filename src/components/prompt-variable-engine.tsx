"use client";

import * as React from "react";
import type { Prompt } from "@/db/schema";
import { CopyPromptDropdown } from "./copy-prompt-dropdown";

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
  const isEn = locale === "en";
  const rawTemplate = isEn ? prompt.contentEn : prompt.contentId;
  const promptTitle = isEn ? prompt.titleEn : prompt.titleId;

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

  return (
    <div className="space-y-4">
      {discoveredVariables.length > 0 && (
        <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-surface space-y-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div>
              <h3 className="text-xs font-semibold text-foreground tracking-tight">
                {isEn ? "Customize Variables" : "Sesuaikan Variabel"}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {isEn
                  ? "Adjust values below to tailor the prompt."
                  : "Sesuaikan nilai variabel di bawah untuk menghasilkan prompt spesifik."}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
              {discoveredVariables.length} {isEn ? "params" : "parameter"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {discoveredVariables.map((v) => {
              const label =
                (isEn ? v.labelEn : v.labelId) || formatVariableLabel(v.name);

              const placeholder =
                v.placeholder ||
                (isEn ? `e.g. ${label.toLowerCase()}` : `mis. ${label.toLowerCase()}`);

              return (
                <div key={v.name} className="space-y-1">
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
                    className="w-full h-8 px-2.5 text-xs rounded-[6px] border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-foreground transition-all"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-2xs">
        <div className="p-3 sm:p-3.5 border-b border-border/70 bg-muted/20 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-foreground tracking-tight">
              {isEn ? "Ready Prompt Output" : "Hasil Prompt Siap Pakai"}
            </h3>
            <span className="text-[10px] font-mono text-muted-foreground">
              {resolvedPrompt.length} {isEn ? "characters" : "karakter"}
            </span>
          </div>

          <CopyPromptDropdown
            promptId={prompt.id}
            title={promptTitle}
            promptText={resolvedPrompt}
            locale={locale}
          />
        </div>

        <pre className="p-4 bg-background/50 text-foreground font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[500px] select-all">
          {resolvedPrompt}
        </pre>
      </div>
    </div>
  );
}