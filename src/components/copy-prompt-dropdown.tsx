"use client";

import * as React from "react";
import {
  Copy,
  Check,
  ChevronDown,
  FileText,
  Sparkles,
  Terminal,
  Bot,
  ExternalLink,
} from "lucide-react";
import { trackPromptAction } from "@/app/actions/track";

interface CopyPromptDropdownProps {
  promptId?: string;
  title: string;
  promptText: string;
  locale: string;
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}

  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

export function CopyPromptDropdown({
  promptId,
  title,
  promptText,
  locale,
}: CopyPromptDropdownProps) {
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

  const handleCopyRaw = async () => {
    const ok = await copyToClipboard(promptText);
    if (ok) {
      setCopiedType("raw");
      if (promptId) trackPromptAction(promptId).catch(() => {});
      setTimeout(() => {
        setCopiedType(null);
        setOpen(false);
      }, 1500);
    }
  };

  const handleCopyClaude = async () => {
    const formatted = `Gunakan templat instruksi prompt "${title}" berikut:\n\n${promptText}`;
    const ok = await copyToClipboard(formatted);
    if (ok) {
      setCopiedType("claude");
      if (promptId) trackPromptAction(promptId).catch(() => {});
      setTimeout(() => {
        setCopiedType(null);
        setOpen(false);
      }, 1500);
    }
  };

  const handleCopyChatGPT = async () => {
    const formatted = `System Directive: ${title}\n\nPrompt:\n${promptText}`;
    const ok = await copyToClipboard(formatted);
    if (ok) {
      setCopiedType("chatgpt");
      if (promptId) trackPromptAction(promptId).catch(() => {});
      setTimeout(() => {
        setCopiedType(null);
        setOpen(false);
      }, 1500);
    }
  };

  const handleCopyCursor = async () => {
    const formatted = `// ProSkillAI Prompt: ${title}\n${promptText}`;
    const ok = await copyToClipboard(formatted);
    if (ok) {
      setCopiedType("cursor");
      if (promptId) trackPromptAction(promptId).catch(() => {});
      setTimeout(() => {
        setCopiedType(null);
        setOpen(false);
      }, 1500);
    }
  };

  const openChatGPT = () => {
    const url = `https://chatgpt.com/?q=${encodeURIComponent(promptText.slice(0, 3000))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const openClaude = () => {
    const url = `https://claude.ai/new?q=${encodeURIComponent(promptText.slice(0, 3000))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div className="inline-flex items-center rounded-[6px] shadow-xs">
        <button
          type="button"
          onClick={handleCopyRaw}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-l-[6px] bg-foreground text-background text-xs font-medium hover:opacity-90 active:scale-95 transition-all cursor-pointer"
        >
          {copiedType === "raw" ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span>
            {copiedType === "raw"
              ? isEn
                ? "Copied!"
                : "Tersalin!"
              : isEn
              ? "Copy Prompt"
              : "Salin Prompt"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={isEn ? "Open copy options" : "Buka opsi salin"}
          className="inline-flex items-center justify-center w-8 h-8 rounded-r-[6px] border-l border-background/20 bg-foreground text-background hover:opacity-90 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-1.5 w-60 rounded-xl border border-border bg-surface p-1 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60">
            {isEn ? "Copy Destinations" : "Tujuan Salin Prompt"}
          </div>

          <div className="p-0.5 space-y-0.5">
            <button
              type="button"
              role="menuitem"
              onClick={handleCopyRaw}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg text-foreground hover:bg-muted transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{isEn ? "Raw Text" : "Teks Jadi"}</span>
              </div>
              {copiedType === "raw" && <Check className="w-3.5 h-3.5 text-emerald-500" />}
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={handleCopyClaude}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg text-foreground hover:bg-muted transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Claude (Anthropic)</span>
              </div>
              {copiedType === "claude" && <Check className="w-3.5 h-3.5 text-emerald-500" />}
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={handleCopyChatGPT}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg text-foreground hover:bg-muted transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Bot className="w-3.5 h-3.5 text-emerald-500" />
                <span>ChatGPT (OpenAI)</span>
              </div>
              {copiedType === "chatgpt" && <Check className="w-3.5 h-3.5 text-emerald-500" />}
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={handleCopyCursor}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg text-foreground hover:bg-muted transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-sky-500" />
                <span>Cursor / Windsurf</span>
              </div>
              {copiedType === "cursor" && <Check className="w-3.5 h-3.5 text-emerald-500" />}
            </button>
          </div>

          <div className="pt-1 mt-1 border-t border-border/60 p-0.5 space-y-0.5">
            <button
              type="button"
              role="menuitem"
              onClick={openChatGPT}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isEn ? "Open in ChatGPT" : "Buka di ChatGPT"}</span>
              </div>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={openClaude}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isEn ? "Open in Claude" : "Buka di Claude"}</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}