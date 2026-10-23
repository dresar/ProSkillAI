"use client";

import * as React from "react";
import {
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Download,
  Terminal,
  Sparkles,
} from "lucide-react";
import { getCurrentDomain } from "@/lib/share-utils";

interface CliInstallBoxProps {
  slug: string;
  locale: string;
  repoUrl?: string;
  content?: string;
}

export function CliInstallBox({
  slug,
  locale,
  repoUrl,
  content,
}: CliInstallBoxProps) {
  const isEn = locale === "en";
  const [mode, setMode] = React.useState<"prompt" | "command">("prompt");
  const [showPrompt, setShowPrompt] = React.useState(true);
  const [commandTarget, setCommandTarget] = React.useState<
    "npx" | "claude" | "agy" | "cursor" | "cmdc"
  >("npx");
  const [copiedPrompt, setCopiedPrompt] = React.useState(false);
  const [copiedCommand, setCopiedCommand] = React.useState(false);

  const [domain, setDomain] = React.useState("skills.biz.id");

  React.useEffect(() => {
    setDomain(getCurrentDomain());
  }, []);

  const fullRepoUrl =
    repoUrl && repoUrl.startsWith("http")
      ? repoUrl
      : `https://github.com/dresar/ProSkillAI/tree/main/skills/${slug}`;

  const promptText = `Follow https://${domain}/skill-install/prompt.md to install only the Agent Skill at ${fullRepoUrl}.`;

  const getCleanRepoShorthand = (url: string) => {
    const match = url.match(/github\.com\/([^/]+\/[^/]+)/);
    return match ? match[1] : slug;
  };

  const getCommand = () => {
    const shorthand = getCleanRepoShorthand(fullRepoUrl);
    switch (commandTarget) {
      case "npx":
        return `npx skills add ${shorthand}`;
      case "claude":
        return `claude --skill ${slug}`;
      case "agy":
        return `agy skill add ${fullRepoUrl}`;
      case "cursor":
        return `npx skills add ${shorthand} --agent cursor`;
      case "cmdc":
        return `cmdc --skill ${slug}`;
      default:
        return `npx skills add ${shorthand}`;
    }
  };

  const currentCommand = getCommand();

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {}
  };

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(currentCommand);
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2000);
    } catch {}
  };

  const handleDownload = () => {
    const textToDownload = content || `# ${slug}\n\n${promptText}`;
    const blob = new Blob([textToDownload], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/90 shadow-sm p-4 sm:p-5 space-y-4">
      <div className="inline-flex rounded-lg bg-muted/60 border border-border/60 p-1">
        <button
          type="button"
          onClick={() => setMode("prompt")}
          className={`h-7 px-3 rounded-[6px] text-xs font-semibold transition-all cursor-pointer ${
            mode === "prompt"
              ? "bg-foreground text-background shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {isEn ? "Prompt" : "Prompt"}
        </button>
        <button
          type="button"
          onClick={() => setMode("command")}
          className={`h-7 px-3 rounded-[6px] text-xs font-semibold transition-all cursor-pointer ${
            mode === "command"
              ? "bg-foreground text-background shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {isEn ? "Command" : "Perintah"}
        </button>
      </div>

      {mode === "prompt" ? (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                {isEn ? "Install with an AI assistant" : "Pasang dengan asisten AI"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isEn
                  ? "Copy this prompt into the AI assistant you're using."
                  : "Salin prompt ini ke asisten AI yang sedang Anda gunakan."}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="h-8 px-3.5 rounded-[6px] bg-[#ea8c68] text-zinc-950 font-semibold text-xs inline-flex items-center gap-1.5 hover:bg-[#ea8c68]/90 transition-transform active:scale-95 shadow-2xs cursor-pointer"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{isEn ? "Prompt Copied!" : "Prompt Disalin!"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isEn ? "Copy install prompt" : "Salin prompt instalasi"}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowPrompt(!showPrompt)}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 cursor-pointer transition-colors px-1.5 py-1"
              >
                <span>{showPrompt ? (isEn ? "Hide prompt" : "Sembunyikan") : (isEn ? "Show prompt" : "Tampilkan")}</span>
                {showPrompt ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {showPrompt && (
            <div className="rounded-xl border border-border/80 bg-background/90 p-3.5 sm:p-4 text-xs sm:text-[13px] font-mono text-zinc-100 dark:text-zinc-200 leading-relaxed break-all select-all shadow-inner">
              {promptText}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                {isEn ? "Install via CLI tool" : "Pasang melalui alat CLI"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isEn
                  ? "Run this command in your terminal or AI coding agent."
                  : "Jalankan perintah ini di terminal atau agent koding AI Anda."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyCommand}
              className="h-8 px-3.5 rounded-[6px] bg-foreground text-background font-semibold text-xs inline-flex items-center gap-1.5 hover:opacity-90 transition-transform active:scale-95 shadow-2xs cursor-pointer self-start sm:self-auto shrink-0"
            >
              {copiedCommand ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEn ? "Command Copied!" : "Perintah Disalin!"}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isEn ? "Copy command" : "Salin perintah"}</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setCommandTarget("npx")}
              className={`h-7 px-2.5 rounded-[5px] text-[11px] font-medium transition-colors cursor-pointer shrink-0 border ${
                commandTarget === "npx"
                  ? "bg-foreground text-background border-foreground font-semibold"
                  : "bg-background text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              npx skills
            </button>
            <button
              type="button"
              onClick={() => setCommandTarget("claude")}
              className={`h-7 px-2.5 rounded-[5px] text-[11px] font-medium transition-colors cursor-pointer shrink-0 border ${
                commandTarget === "claude"
                  ? "bg-foreground text-background border-foreground font-semibold"
                  : "bg-background text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              Claude Code
            </button>
            <button
              type="button"
              onClick={() => setCommandTarget("agy")}
              className={`h-7 px-2.5 rounded-[5px] text-[11px] font-medium transition-colors cursor-pointer shrink-0 border ${
                commandTarget === "agy"
                  ? "bg-foreground text-background border-foreground font-semibold"
                  : "bg-background text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              Antigravity
            </button>
            <button
              type="button"
              onClick={() => setCommandTarget("cursor")}
              className={`h-7 px-2.5 rounded-[5px] text-[11px] font-medium transition-colors cursor-pointer shrink-0 border ${
                commandTarget === "cursor"
                  ? "bg-foreground text-background border-foreground font-semibold"
                  : "bg-background text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              Cursor / Windsurf
            </button>
            <button
              type="button"
              onClick={() => setCommandTarget("cmdc")}
              className={`h-7 px-2.5 rounded-[5px] text-[11px] font-medium transition-colors cursor-pointer shrink-0 border ${
                commandTarget === "cmdc"
                  ? "bg-foreground text-background border-foreground font-semibold"
                  : "bg-background text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              Command Code
            </button>
          </div>

          <div className="rounded-xl border border-border/80 bg-background/90 p-3.5 sm:p-4 text-xs sm:text-[13px] font-mono text-zinc-100 dark:text-zinc-200 leading-relaxed select-all shadow-inner">
            {currentCommand}
          </div>
        </div>
      )}

      <div className="pt-3 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <span className="text-muted-foreground">
          {isEn
            ? "Prefer a local copy? Download the files currently available to Skills."
            : "Lebih suka salinan lokal? Unduh berkas yang saat ini tersedia di Skills."}
        </span>

        <button
          type="button"
          onClick={handleDownload}
          className="h-8 px-3 rounded-[6px] border border-border bg-background hover:bg-muted text-foreground font-medium inline-flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isEn ? "Download File" : "Unduh Berkas"}</span>
        </button>
      </div>
    </div>
  );
}
