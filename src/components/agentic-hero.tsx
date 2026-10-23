"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, Terminal } from "lucide-react";

interface AgenticHeroProps {
  locale: string;
  totalSkills: number;
  totalCategories: number;
}

export function AgenticHero({
  locale,
  totalSkills,
  totalCategories,
}: AgenticHeroProps) {
  const isEn = locale === "en";
  const [copied, setCopied] = React.useState(false);

  const command = "npx skills add Leonxlnx/taste-skill@design-taste-frontend";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const platforms = [
    "CLAUDE CODE",
    "OPENAI CODEX",
    "CURSOR",
    "GEMINI CLI",
    "GITHUB COPILOT",
    "WINDSURF",
    "AIDER",
    "HERMES",
    "NEOVIM",
  ];

  return (
    <section className="w-full space-y-10 sm:space-y-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-5 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] border border-border/80 bg-surface/80 text-[10px] sm:text-[11px] font-mono text-muted-foreground uppercase tracking-widest shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {totalSkills}+ {isEn ? "CURATED SKILLS FOR AI AGENTS" : "SKILL TERKURASI UNTUK AGEN AI"}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.08]">
            {isEn ? (
              <>
                Discover the Best <br />
                AI Agent <span className="font-serif italic font-normal text-muted-foreground">Skills</span>
              </>
            ) : (
              <>
                Temukan Koleksi <br />
                Skill AI Agent <span className="font-serif italic font-normal text-muted-foreground">Terbaik</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
            {isEn
              ? "The curated directory for Claude Code, Codex, Cursor, Gemini CLI and every agent that reads SKILL.md. Find, compare, and install skills that supercharge your workflow."
              : "Direktori terkurasi untuk Claude Code, Codex, Cursor, Gemini CLI, dan setiap AI agent yang membaca SKILL.md. Temukan, bandingkan, dan pasang skill untuk meningkatkan alur kerja rekayasa Anda."}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#catalog"
              className="inline-flex items-center gap-2 h-9 px-4 rounded-[6px] bg-foreground text-background font-semibold text-xs hover:opacity-90 transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              <span>{isEn ? "Browse Skills" : "Jelajahi Skill"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <Link
              href={`/${locale}/skills/submit`}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-[6px] border border-border bg-surface text-foreground font-semibold text-xs hover:bg-muted transition-all active:scale-95 shadow-2xs"
            >
              <span>{isEn ? "Submit Your Skill" : "Kirimkan Skill"}</span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-xl border border-white/10 bg-[#0d0e12] p-4 sm:p-5 text-xs font-mono shadow-2xl relative overflow-hidden text-zinc-300">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[10px] text-zinc-400">
              <span className="tracking-widest uppercase font-semibold text-zinc-300">
                INSTALL DEMO
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              </div>
            </div>

            <div className="space-y-2 text-[11px] leading-relaxed select-text">
              <div className="flex items-center justify-between gap-2">
                <span className="text-zinc-100 font-semibold">$ {command}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                  title="Copy command"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className="text-zinc-500">Resolving package...</p>
              <p className="text-emerald-400 font-medium">Installed Taste Skill (S-Rank)</p>
              <p className="text-zinc-400 text-[10px]">Compatible with Claude Code, Cursor, Codex</p>

              <div className="pt-2 text-zinc-100 font-semibold">$ npx skills list</div>
              <ul className="space-y-0.5 text-zinc-300 text-[10px] pl-1">
                <li>taste-skill <span className="text-zinc-500 font-mono">(⭐ 101k · S-Rank)</span></li>
                <li>superpowers <span className="text-zinc-500 font-mono">(⭐ 304k · Engineering)</span></li>
                <li>ecc-backend-patterns <span className="text-zinc-500 font-mono">(⭐ 287k · Systems)</span></li>
                <li>anthropic-frontend <span className="text-zinc-500 font-mono">(⭐ 183k · Official)</span></li>
                <li>caveman <span className="text-zinc-500 font-mono">(⭐ 114k · 65% Tokens)</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-y border-border/80 divide-y sm:divide-y-0 sm:divide-x divide-border/80 grid grid-cols-2 sm:grid-cols-4 py-5 sm:py-6 text-center">
        <div className="py-2 sm:py-0 px-4 space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
            {totalSkills}+
          </div>
          <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
            {isEn ? "CURATED SKILLS" : "SKILL TERKURASI"}
          </div>
        </div>

        <div className="py-2 sm:py-0 px-4 space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
            {totalCategories}
          </div>
          <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
            {isEn ? "CATEGORIES" : "KATEGORI"}
          </div>
        </div>

        <div className="py-2 sm:py-0 px-4 space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
            9
          </div>
          <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
            {isEn ? "PLATFORMS" : "PLATFORM"}
          </div>
        </div>

        <div className="py-2 sm:py-0 px-4 space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
            100%
          </div>
          <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
            {isEn ? "OPEN SOURCE" : "OPEN SOURCE"}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-muted-foreground uppercase tracking-widest border-b border-border/80 pb-4">
        <span className="font-semibold text-foreground">
          {isEn ? "WORKS ACROSS 9 AGENT PLATFORMS" : "KOMPATIBEL DENGAN 9 PLATFORM AGENT"}
        </span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {platforms.map((p) => (
            <span key={p} className="hover:text-foreground transition-colors">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
