"use client";

import * as React from "react";
import { Copy, Check, Terminal, FileCode, Cpu } from "lucide-react";

interface McpInstallTabsProps {
  serverName: string;
  installSnippet: string;
  claudeConfigSnippet: string;
  locale: string;
}

export function McpInstallTabs({
  serverName,
  installSnippet,
  claudeConfigSnippet,
  locale,
}: McpInstallTabsProps) {
  const [activeTab, setActiveTab] = React.useState<"claude" | "npx" | "cursor">("claude");
  const [copiedTab, setCopiedTab] = React.useState<string | null>(null);

  const isEn = locale === "en";

  let formattedClaudeJson = claudeConfigSnippet;
  try {
    const parsed = JSON.parse(claudeConfigSnippet);
    formattedClaudeJson = JSON.stringify(parsed, null, 2);
  } catch {}

  const cursorSnippet = JSON.stringify(
    {
      mcpServers: {
        [serverName.toLowerCase().replace(/\s+/g, "-")]: {
          command: "npx",
          args: ["-y", installSnippet.replace(/^npx\s+(-y\s+)?/, "")],
        },
      },
    },
    null,
    2
  );

  const currentSnippet =
    activeTab === "claude"
      ? formattedClaudeJson
      : activeTab === "npx"
      ? installSnippet
      : cursorSnippet;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentSnippet);
      setCopiedTab(activeTab);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch {}
  };

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-2xs space-y-0">
      <div className="px-4 py-3 border-b border-border bg-muted/40 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("claude")}
            className={`h-7 px-2.5 rounded-[5px] text-xs font-mono font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "claude"
                ? "bg-foreground text-background shadow-2xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Claude Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("npx")}
            className={`h-7 px-2.5 rounded-[5px] text-xs font-mono font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "npx"
                ? "bg-foreground text-background shadow-2xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>npx CLI</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cursor")}
            className={`h-7 px-2.5 rounded-[5px] text-xs font-mono font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "cursor"
                ? "bg-foreground text-background shadow-2xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Cursor AI</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={isEn ? "Copy configuration" : "Salin konfigurasi"}
          className="h-7 px-2.5 rounded-[5px] border border-border bg-background hover:bg-muted text-xs font-medium text-foreground inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
        >
          {copiedTab === activeTab ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-semibold">
                {isEn ? "Copied" : "Disalin"}
              </span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{isEn ? "Copy Snippet" : "Salin Snippet"}</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 bg-background">
        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-2">
          <span>
            {activeTab === "claude"
              ? "claude_desktop_config.json"
              : activeTab === "npx"
              ? "Terminal Shell"
              : ".cursor/mcp.json"}
          </span>
          <span>{activeTab === "npx" ? "bash / zsh / pwsh" : "JSON format"}</span>
        </div>
        <pre className="p-3.5 rounded-lg border border-border/80 bg-muted/20 font-mono text-xs text-foreground overflow-x-auto leading-relaxed select-all">
          <code>{currentSnippet}</code>
        </pre>
      </div>
    </div>
  );
}
