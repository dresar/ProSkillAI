"use client";

import * as React from "react";
import {
  Copy,
  Check,
  ChevronDown,
  FileText,
  Download,
} from "lucide-react";
import { ProviderLogo } from "./provider-logos";
import { trackSkillAction } from "@/app/actions/track";

interface CopySkillDropdownProps {
  skillId: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  locale: string;
}

export function CopySkillDropdown({
  skillId,
  slug,
  title,
  summary,
  content,
  locale,
}: CopySkillDropdownProps) {
  const isEn = locale === "en";
  const [open, setOpen] = React.useState(false);
  const [copiedType, setCopiedType] = React.useState<string | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleCopyMarkdown = async () => {
    await navigator.clipboard.writeText(content);
    setCopiedType("page");
    trackSkillAction(skillId, "copy").catch(() => {});
    setTimeout(() => {
      setCopiedType(null);
      setOpen(false);
    }, 1500);
  };

  const handleCopyMcp = async () => {
    const mcpText = `https://proskillai.dev/api/mcp/skills/${slug}`;
    await navigator.clipboard.writeText(mcpText);
    setCopiedType("mcp");
    trackSkillAction(skillId, "copy").catch(() => {});
    setTimeout(() => {
      setCopiedType(null);
      setOpen(false);
    }, 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slug}.md`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    trackSkillAction(skillId, "download").catch(() => {});
    setOpen(false);
  };

  const openChatGPT = () => {
    const promptText = `Berikut instruksi skill AI "${title}":\n\n${content}\n\nJelaskan dan implementasikan skill ini langkah demi langkah.`;
    const targetUrl = `https://chatgpt.com/?q=${encodeURIComponent(promptText.slice(0, 3000))}`;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const openClaude = () => {
    const promptText = `Berikut instruksi skill AI "${title}":\n\n${content}\n\nJelaskan dan implementasikan skill ini langkah demi langkah.`;
    const targetUrl = `https://claude.ai/new?q=${encodeURIComponent(promptText.slice(0, 3000))}`;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const openPerplexity = () => {
    const promptText = `Skill AI Agent: ${title}. ${summary}`;
    const targetUrl = `https://www.perplexity.ai/search?q=${encodeURIComponent(promptText)}`;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const openCursor = () => {
    const cursorPrompt = `Gunakan skill ${title} berikut dalam proyek ini:\n\n${content}`;
    navigator.clipboard.writeText(cursorPrompt);
    setCopiedType("cursor");
    setTimeout(() => {
      setCopiedType(null);
      setOpen(false);
    }, 1500);
  };

  const openVSCode = () => {
    const vscodePrompt = `Gunakan skill ${title} berikut dalam sesi coding:\n\n${content}`;
    navigator.clipboard.writeText(vscodePrompt);
    setCopiedType("vscode");
    setTimeout(() => {
      setCopiedType(null);
      setOpen(false);
    }, 1500);
  };

  return (
    <div className="relative inline-flex items-center" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 h-8 px-3 rounded-[6px] bg-foreground text-background hover:opacity-90 transition-transform active:scale-95 text-xs font-semibold cursor-pointer shadow-xs select-none"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {copiedType === "page" ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
        <span>
          {copiedType === "page"
            ? isEn
              ? "Copied!"
              : "Tersalin!"
            : isEn
            ? "Copy page"
            : "Salin SKILL.md"}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 opacity-80 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Skill actions"
          className="absolute left-0 sm:left-auto sm:right-auto top-full mt-1.5 w-80 rounded-xl border border-border bg-surface/98 backdrop-blur-md shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-0.5"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleCopyMarkdown}
            className="w-full flex items-start gap-3 p-2 rounded-lg text-left hover:bg-muted/70 transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-[6px] border border-border bg-muted/40 text-foreground flex items-center justify-center shrink-0 mt-0.5 group-hover:border-foreground/30">
              {copiedType === "page" ? (
                <Check className="w-3.5 h-3.5 text-foreground" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>{isEn ? "Copy page" : "Salin SKILL.md"}</span>
                {copiedType === "page" && (
                  <span className="text-[10px] text-emerald-500 font-mono">
                    {isEn ? "Copied" : "Tersalin"}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {isEn
                  ? "Copy page as Markdown for LLMs"
                  : "Salin teks halaman sebagai Markdown untuk LLM"}
              </p>
            </div>
          </button>

          <a
            role="menuitem"
            href={`/api/skills/${slug}/raw?lang=${locale}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="w-full flex items-start gap-3 p-2 rounded-lg text-left hover:bg-muted/70 transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-[6px] border border-border bg-muted/40 text-foreground flex items-center justify-center shrink-0 mt-0.5 group-hover:border-foreground/30">
              <FileText className="w-3.5 h-3.5 text-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-foreground">
                {isEn ? "View as Markdown ↗" : "Lihat sebagai Markdown ↗"}
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {isEn
                  ? "View this page as plain text"
                  : "Buka halaman ini sebagai plain text"}
              </p>
            </div>
          </a>

          <div className="h-px bg-border/60 my-1" />

          <button
            type="button"
            role="menuitem"
            onClick={openChatGPT}
            className="w-full flex items-start gap-3 p-2 rounded-lg text-left hover:bg-muted/70 transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-[6px] border border-border bg-muted/40 text-foreground flex items-center justify-center shrink-0 mt-0.5 group-hover:border-foreground/30">
              <ProviderLogo provider="openai" className="w-3.5 h-3.5 text-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-foreground">
                {isEn ? "Open in ChatGPT ↗" : "Buka di ChatGPT ↗"}
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {isEn
                  ? "Ask questions about this page"
                  : "Tanyakan dan gunakan skill ini di ChatGPT"}
              </p>
            </div>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={openClaude}
            className="w-full flex items-start gap-3 p-2 rounded-lg text-left hover:bg-muted/70 transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-[6px] border border-border bg-muted/40 text-foreground flex items-center justify-center shrink-0 mt-0.5 group-hover:border-foreground/30">
              <ProviderLogo provider="claude" className="w-3.5 h-3.5 text-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-foreground">
                {isEn ? "Open in Claude ↗" : "Buka di Claude ↗"}
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {isEn
                  ? "Ask questions about this page"
                  : "Tanyakan dan gunakan skill ini di Claude"}
              </p>
            </div>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={openPerplexity}
            className="w-full flex items-start gap-3 p-2 rounded-lg text-left hover:bg-muted/70 transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-[6px] border border-border bg-muted/40 text-foreground flex items-center justify-center shrink-0 mt-0.5 group-hover:border-foreground/30">
              <ProviderLogo provider="perplexity" className="w-3.5 h-3.5 text-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-foreground">
                {isEn ? "Open in Perplexity ↗" : "Buka di Perplexity ↗"}
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {isEn
                  ? "Ask questions about this page"
                  : "Riset dan analisis di Perplexity AI"}
              </p>
            </div>
          </button>

          <div className="h-px bg-border/60 my-1" />

          <button
            type="button"
            role="menuitem"
            onClick={handleCopyMcp}
            className="w-full flex items-start gap-3 p-2 rounded-lg text-left hover:bg-muted/70 transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-[6px] border border-border bg-muted/40 text-foreground flex items-center justify-center shrink-0 mt-0.5 group-hover:border-foreground/30">
              <ProviderLogo provider="mcp" className="w-3.5 h-3.5 text-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>{isEn ? "Copy MCP Server" : "Salin Server MCP"}</span>
                {copiedType === "mcp" && (
                  <span className="text-[10px] text-emerald-500 font-mono">
                    {isEn ? "Copied" : "Tersalin"}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {isEn
                  ? "Copy MCP Server URL to clipboard"
                  : "Salin URL server MCP ke papan klip"}
              </p>
            </div>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={openCursor}
            className="w-full flex items-start gap-3 p-2 rounded-lg text-left hover:bg-muted/70 transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-[6px] border border-border bg-muted/40 text-foreground flex items-center justify-center shrink-0 mt-0.5 group-hover:border-foreground/30">
              <ProviderLogo provider="cursor" className="w-3.5 h-3.5 text-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>{isEn ? "Connect to Cursor ↗" : "Hubungkan ke Cursor ↗"}</span>
                {copiedType === "cursor" && (
                  <span className="text-[10px] text-emerald-500 font-mono">
                    {isEn ? "Copied" : "Tersalin"}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {isEn
                  ? "Install MCP Server on Cursor"
                  : "Pasang prompt & aturan di Cursor"}
              </p>
            </div>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={openVSCode}
            className="w-full flex items-start gap-3 p-2 rounded-lg text-left hover:bg-muted/70 transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-[6px] border border-border bg-muted/40 text-foreground flex items-center justify-center shrink-0 mt-0.5 group-hover:border-foreground/30">
              <ProviderLogo provider="vscode" className="w-3.5 h-3.5 text-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>{isEn ? "Connect to VS Code ↗" : "Hubungkan ke VS Code ↗"}</span>
                {copiedType === "vscode" && (
                  <span className="text-[10px] text-emerald-500 font-mono">
                    {isEn ? "Copied" : "Tersalin"}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {isEn
                  ? "Install MCP Server on VS Code"
                  : "Pasang prompt & aturan di VS Code"}
              </p>
            </div>
          </button>

          <div className="h-px bg-border/60 my-1" />

          <button
            type="button"
            role="menuitem"
            onClick={handleDownload}
            className="w-full flex items-start gap-3 p-2 rounded-lg text-left hover:bg-muted/70 transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-[6px] border border-border bg-muted/40 text-foreground flex items-center justify-center shrink-0 mt-0.5 group-hover:border-foreground/30">
              <Download className="w-3.5 h-3.5 text-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-foreground">
                {isEn ? "Download File" : "Unduh Berkas .md"}
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {isEn
                  ? "Download SKILL.md file to your computer"
                  : "Unduh file SKILL.md ke komputer Anda"}
              </p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
