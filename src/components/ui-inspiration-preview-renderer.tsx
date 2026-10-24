"use client";

import * as React from "react";
import { Terminal, Check, Copy, Sparkles, Layers, Shield, Cpu, Activity, Clock } from "lucide-react";

interface PreviewRendererProps {
  slug: string;
  className?: string;
}

export function UiInspirationPreviewRenderer({ slug, className = "" }: PreviewRendererProps) {
  const [copied, setCopied] = React.useState(false);
  const [selectedModel, setSelectedModel] = React.useState("claude");
  const [activeTab, setActiveTab] = React.useState("all");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  switch (slug) {
    case "compact-marketplace-card":
      return (
        <div className={`w-full max-w-[280px] rounded-[8px] border border-border/80 bg-surface p-3 text-foreground shadow-2xs transition-all hover:border-foreground/30 ${className}`}>
          <div className="relative aspect-square w-full overflow-hidden rounded-[6px] bg-muted/40 border border-border/50 flex flex-col items-center justify-center p-3">
            <Layers className="w-8 h-8 text-muted-foreground/60 mb-2" />
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Template Preview 1:1
            </span>
            <span className="absolute top-2 left-2 rounded-[4px] bg-background/90 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-foreground border border-border/60">
              v2.4
            </span>
          </div>
          <div className="mt-2.5 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Design Systems</span>
              <span className="font-mono text-amber-500 font-semibold">★ 4.9</span>
            </div>
            <h4 className="truncate text-xs font-semibold tracking-tight text-foreground">
              Monochrome Taste Theme
            </h4>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
            <button
              type="button"
              className="inline-flex h-[32px] items-center justify-center rounded-[6px] border border-border bg-background px-2 text-[11px] font-medium text-foreground hover:bg-muted active:scale-95 transition-all"
            >
              Preview
            </button>
            <button
              type="button"
              className="inline-flex h-[32px] items-center justify-center rounded-[6px] bg-foreground px-2 text-[11px] font-semibold text-background hover:opacity-90 active:scale-95 transition-all shadow-2xs"
            >
              Use
            </button>
          </div>
        </div>
      );

    case "agentic-terminal-console":
      return (
        <div className={`w-full max-w-sm rounded-xl border border-cyan-500/20 bg-[#070b13] p-3.5 font-mono text-xs text-zinc-300 shadow-[0_0_25px_-5px_rgba(6,182,212,0.15)] ${className}`}>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[10px] text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-cyan-400" />
              <span className="font-semibold text-zinc-200">AGENT CLI</span>
            </div>
            <span className="rounded-[4px] bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400 border border-emerald-500/20">
              READY
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 rounded-[5px] bg-black/60 p-1.5 border border-white/10 text-[11px]">
              <span className="text-zinc-100 font-semibold truncate">
                <span className="text-cyan-400 mr-1">$</span>npx skills add obra/superpowers
              </span>
              <button
                type="button"
                onClick={() => handleCopy("npx skills add obra/superpowers")}
                className="rounded p-1 text-zinc-400 hover:text-zinc-100 hover:bg-white/10 active:scale-95"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <div className="text-[10px] text-zinc-500 space-y-0.5 pt-0.5">
              <div className="text-emerald-400">✓ Package verified (SKILL.md v2.1)</div>
              <div className="text-zinc-400">✓ Injected into Claude Code & Cursor</div>
            </div>
          </div>
        </div>
      );

    case "floating-island-navbar":
      return (
        <div className={`w-full flex justify-center py-2 ${className}`}>
          <nav className="inline-flex h-10 items-center gap-1 rounded-[10px] border border-border/80 bg-background/90 px-3 shadow-xs backdrop-blur-md">
            <div className="flex items-center gap-1.5 pr-2.5 border-r border-border/70 font-semibold text-[11px] tracking-wider uppercase text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <span>PROSKILL</span>
            </div>
            <div className="flex items-center gap-1 pl-1">
              <span className="rounded-[5px] px-2 py-0.5 text-[11px] font-semibold text-foreground bg-muted/60">
                Skills
              </span>
              <span className="rounded-[5px] px-2 py-0.5 text-[11px] font-medium text-muted-foreground hover:text-foreground cursor-pointer">
                Prompts
              </span>
            </div>
            <div className="pl-2 border-l border-border/70">
              <span className="inline-flex h-6 items-center gap-1 rounded-[4px] border border-border bg-muted/40 px-1.5 text-[10px] font-mono text-muted-foreground">
                <kbd className="rounded bg-background px-1 text-[9px] font-semibold border border-border">⌘K</kbd>
              </span>
            </div>
          </nav>
        </div>
      );

    case "bento-feature-grid":
      return (
        <div className={`w-full max-w-sm grid grid-cols-2 gap-2 text-left ${className}`}>
          <div className="col-span-2 rounded-[8px] border border-border/80 bg-surface p-3 space-y-1">
            <span className="inline-flex items-center gap-1 rounded bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-mono text-cyan-500 font-semibold">
              SPECIFICATION
            </span>
            <h5 className="text-xs font-bold text-foreground">Zero-Bloat Autonomous Architecture</h5>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Deterministic boundaries across Claude Code & Cursor IDE runtimes.
            </p>
          </div>
          <div className="rounded-[8px] border border-border/80 bg-surface p-3 flex flex-col justify-between">
            <span className="font-mono text-xl font-bold text-foreground">99.8%</span>
            <span className="text-[9px] text-muted-foreground font-mono uppercase">Edge Uptime</span>
          </div>
          <div className="rounded-[8px] border border-border/80 bg-surface p-3 flex flex-col justify-between">
            <span className="font-mono text-xl font-bold text-foreground">12ms</span>
            <span className="text-[9px] text-muted-foreground font-mono uppercase">Neon Latency</span>
          </div>
        </div>
      );

    case "segmented-control-toolbar":
      return (
        <div className={`w-full max-w-sm rounded-[8px] border border-border/80 bg-surface p-2.5 space-y-2 ${className}`}>
          <div className="inline-flex h-7 items-center rounded-[6px] bg-muted/60 p-0.5 border border-border/50 text-[10px] font-medium w-full">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`flex-1 h-full rounded-[4px] transition-all ${
                activeTab === "all" ? "bg-background text-foreground font-semibold shadow-2xs" : "text-muted-foreground"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("skills")}
              className={`flex-1 h-full rounded-[4px] transition-all ${
                activeTab === "skills" ? "bg-background text-foreground font-semibold shadow-2xs" : "text-muted-foreground"
              }`}
            >
              Skills
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("prompts")}
              className={`flex-1 h-full rounded-[4px] transition-all ${
                activeTab === "prompts" ? "bg-background text-foreground font-semibold shadow-2xs" : "text-muted-foreground"
              }`}
            >
              Prompts
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              readOnly
              value="filter by tag..."
              className="h-7 flex-1 rounded-[5px] border border-border bg-background px-2 text-[11px] text-muted-foreground"
            />
            <button
              type="button"
              className="h-7 px-2.5 rounded-[5px] border border-border bg-background text-[10px] font-semibold text-foreground active:scale-95"
            >
              Search
            </button>
          </div>
        </div>
      );

    case "telemetry-metrics-badge":
      return (
        <div className={`flex flex-wrap items-center justify-center gap-2 py-3 ${className}`}>
          <div className="inline-flex items-center gap-2 rounded-[6px] border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-semibold">SERVERLESS NEON</span>
            <span className="text-muted-foreground">· 12ms</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-[6px] border border-border/80 bg-surface px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
            <Activity className="w-3 h-3 text-cyan-500" />
            <span className="text-foreground font-semibold">Edge HTTP</span>
          </div>
        </div>
      );

    case "model-selector-pill-group":
      return (
        <div className={`w-full max-w-sm space-y-2 ${className}`}>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "claude", name: "Claude 3.7", meta: "Reasoning" },
              { id: "codex", name: "Codex", meta: "Fast" },
              { id: "deepseek", name: "DeepSeek", meta: "Pro" },
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`p-2 rounded-[6px] border cursor-pointer transition-all text-left ${
                  selectedModel === m.id
                    ? "border-foreground bg-surface shadow-xs font-semibold"
                    : "border-border/80 bg-surface/50 opacity-75 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-foreground">{m.name}</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      selectedModel === m.id ? "bg-emerald-500" : "bg-muted-foreground/40"
                    }`}
                  />
                </div>
                <div className="text-[9px] font-mono text-muted-foreground mt-0.5">{m.meta}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "clean-dialog-modal":
      return (
        <div className={`w-full max-w-[280px] rounded-[8px] border border-border/80 bg-background p-3.5 shadow-lg space-y-2.5 text-left ${className}`}>
          <div className="space-y-1">
            <h5 className="text-xs font-semibold text-foreground">Deploy Skill to Production?</h5>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Injects verified rules into Claude Code & Cursor runtimes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-border/60">
            <button
              type="button"
              className="h-7 rounded-[5px] border border-border bg-background text-[10px] font-medium text-foreground hover:bg-muted active:scale-95"
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-7 rounded-[5px] bg-foreground text-[10px] font-semibold text-background hover:opacity-90 active:scale-95 shadow-2xs"
            >
              Deploy
            </button>
          </div>
        </div>
      );

    case "prompt-diff-inspector":
      return (
        <div className={`w-full max-w-sm rounded-[8px] border border-border/80 bg-surface font-mono text-[10px] overflow-hidden text-left ${className}`}>
          <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-border/80 bg-muted/40 text-[9px] text-muted-foreground">
            <span className="font-semibold text-foreground">prompt-diff.md</span>
            <span className="rounded bg-background px-1 py-0.2 border border-border font-mono">+14 tokens</span>
          </div>
          <div className="p-2 space-y-1">
            <div className="text-zinc-500">  system_prompt:</div>
            <div className="bg-red-500/10 text-red-600 dark:text-red-400 px-1 py-0.5 rounded-[3px]">
              - You are a generic AI helper.
            </div>
            <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1 py-0.5 rounded-[3px]">
              + You are Antigravity, master systems architect.
            </div>
          </div>
        </div>
      );

    case "micro-toast-notification":
      return (
        <div className={`w-full max-w-[260px] rounded-[6px] border border-border/90 bg-background p-2.5 shadow-md relative overflow-hidden text-left ${className}`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[11px] font-medium text-foreground">Skill added to favorites</span>
            </div>
            <span className="text-[10px] font-semibold text-foreground underline cursor-pointer">Undo</span>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-foreground/20">
            <div className="h-full bg-foreground w-2/3" />
          </div>
        </div>
      );

    case "minimalist-pricing-matrix":
      return (
        <div className={`w-full max-w-[240px] rounded-[8px] border border-border/80 bg-surface p-3.5 space-y-2.5 text-left shadow-2xs ${className}`}>
          <div>
            <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Pro Agent</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold text-foreground">$19</span>
              <span className="text-[10px] text-muted-foreground">/mo</span>
            </div>
          </div>
          <ul className="space-y-1 text-[10px] text-muted-foreground pt-1.5 border-t border-border/60">
            <li className="flex items-center gap-1 text-foreground font-medium">
              <span className="text-emerald-500">✓</span> Unlimited Skill Imports
            </li>
            <li className="flex items-center gap-1">
              <span className="text-emerald-500">✓</span> Serverless Edge Execution
            </li>
          </ul>
          <button
            type="button"
            className="w-full h-7 rounded-[5px] bg-foreground text-background font-semibold text-[10px] active:scale-95 shadow-2xs"
          >
            Upgrade
          </button>
        </div>
      );

    case "agent-task-progress-drawer":
      return (
        <div className={`w-full max-w-sm rounded-t-[8px] border-t-2 border-cyan-500/50 border-x border-border/80 bg-background p-3 space-y-2 font-mono text-left ${className}`}>
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-semibold text-foreground uppercase tracking-wider">Subagent Progress</span>
            </div>
            <span className="text-[9px] text-muted-foreground">Step 3/4</span>
          </div>
          <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-cyan-500 w-3/4 rounded-full" />
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Verifying build output...</span>
            <span className="text-foreground underline cursor-pointer">Pause</span>
          </div>
        </div>
      );

    default:
      return (
        <div className={`w-full p-4 rounded-[8px] border border-border/80 bg-surface flex flex-col items-center justify-center text-center ${className}`}>
          <Sparkles className="w-6 h-6 text-cyan-500 mb-1" />
          <span className="text-xs font-semibold text-foreground">Interactive Component</span>
          <span className="text-[10px] font-mono text-muted-foreground">Preview Standard v2.1</span>
        </div>
      );
  }
}
