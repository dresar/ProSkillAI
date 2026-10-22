"use client";

import * as React from "react";
import { Check, Copy, X } from "lucide-react";

interface VariableItem {
  name: string;
  labelId: string;
  labelEn: string;
  defaultValue?: string;
  placeholder?: string;
}

interface PromptPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  contentId: string;
  contentEn: string;
  variables: VariableItem[];
  initialLang: "id" | "en";
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const VARIABLE_PATTERN = /\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g;

export function PromptPreviewDialog({
  open,
  onClose,
  contentId,
  contentEn,
  variables,
  initialLang,
}: PromptPreviewDialogProps) {
  const [lang, setLang] = React.useState<"id" | "en">(initialLang);
  const [formValues, setFormValues] = React.useState<Record<string, string>>({});
  const [copied, setCopied] = React.useState(false);

  const template = lang === "en" ? contentEn : contentId;

  const discovered = React.useMemo(() => {
    const list: VariableItem[] = variables.map((variable) => ({ ...variable }));
    const names = new Set(list.map((variable) => variable.name));

    for (const match of template.matchAll(VARIABLE_PATTERN)) {
      const name = match[1];
      if (!names.has(name)) {
        names.add(name);
        list.push({
          name,
          labelId: name.replace(/[_-]/g, " "),
          labelEn: name.replace(/[_-]/g, " "),
          defaultValue: "",
          placeholder: `Masukkan ${name}`,
        });
      }
    }
    return list;
  }, [variables, template]);

  const resolved = React.useMemo(() => {
    let result = template;
    for (const variable of discovered) {
      const value = formValues[variable.name] ?? variable.defaultValue ?? "";
      if (!value) continue;
      result = result.replace(
        new RegExp(`\\{\\{\\s*${escapeRegex(variable.name)}\\s*\\}\\}`, "g"),
        value
      );
    }
    return result;
  }, [template, discovered, formValues]);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resolved);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Pratinjau Prompt"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl border border-border bg-surface shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 p-3 border-b border-border sticky top-0 bg-surface z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">Pratinjau Prompt</span>
            <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted">
              <button
                type="button"
                onClick={() => setLang("id")}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                  lang === "id"
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface"
                }`}
              >
                Indonesia
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                  lang === "en"
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface"
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-foreground text-background hover:opacity-90 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Tersalin!" : "Salin Hasil"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Tutup pratinjau"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-3 space-y-3">
          {discovered.length > 0 && (
            <div className="p-3 rounded-lg border border-border bg-muted/30 space-y-2">
              <h4 className="text-xs font-semibold text-foreground">Isi Variabel</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {discovered.map((variable) => (
                  <div key={variable.name} className="space-y-1">
                    <label className="block text-[11px] text-muted-foreground capitalize">
                      {lang === "en" ? variable.labelEn : variable.labelId}
                      <span className="font-mono ml-1">({`{{${variable.name}}}`})</span>
                    </label>
                    <input
                      type="text"
                      value={formValues[variable.name] ?? variable.defaultValue ?? ""}
                      placeholder={variable.placeholder || `{{${variable.name}}}`}
                      onChange={(event) =>
                        setFormValues((prev) => ({
                          ...prev,
                          [variable.name]: event.target.value,
                        }))
                      }
                      className="w-full h-8 px-2.5 text-xs rounded-lg border border-border bg-surface text-foreground focus:outline-2 focus:outline-foreground"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1.5">
              Hasil Prompt
            </div>
            <pre className="p-3 rounded-lg border border-border bg-muted/40 text-foreground font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[420px]">
              {resolved}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
