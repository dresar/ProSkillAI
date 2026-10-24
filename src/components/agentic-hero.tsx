"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Copy, Terminal, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AgenticHeroProps {
  locale: string;
  totalSkills: number;
  totalCategories: number;
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1400;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(easeOutQuad * (end - start) + start);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

const PLATFORM_ITEMS = [
  { name: "Claude Code", logo: "/images/platforms/claude.png" },
  { name: "OpenAI Codex", logo: "/images/platforms/openai.png" },
  { name: "Cursor", logo: "/images/platforms/cursor.png" },
  { name: "Gemini CLI", logo: "/images/platforms/gemini.png" },
  { name: "GitHub Copilot", logo: "/images/platforms/copilot.png" },
  { name: "Windsurf", logo: "/images/platforms/windsurf.png" },
  { name: "Aider", logo: "/images/platforms/aider.png" },
  { name: "Hermes", logo: "/images/platforms/hermes.png" },
  { name: "Neovim", logo: "/images/platforms/neovim.png" },
];

interface CommandConfig {
  cmd: string;
  pkg: string;
  title: string;
  author: string;
  stars: string;
  rulesCount: string;
  targets: string;
}

const TERMINAL_COMMANDS: CommandConfig[] = [
  {
    cmd: "npx skills add Leonxlnx/taste-skill",
    pkg: "Leonxlnx/taste-skill@frontend-taste",
    title: "Frontend Taste & Design Systems",
    author: "Leonxlnx",
    stars: "101k",
    rulesCount: "18 strict UI/UX constraints",
    targets: "Claude Code, Cursor, Codex, Windsurf",
  },
  {
    cmd: "npx skills add obra/superpowers",
    pkg: "obra/superpowers@autonomous-tdd",
    title: "Superpowers Autonomous Engineering",
    author: "obra",
    stars: "304k",
    rulesCount: "24 TDD & architecture workflows",
    targets: "Claude Code, Cursor, Aider, Hermes",
  },
  {
    cmd: "npx skills add anthropic/frontend",
    pkg: "anthropic/frontend@design-mastery",
    title: "Official Anthropic UI Engineering",
    author: "anthropic",
    stars: "183k",
    rulesCount: "32 accessibility & perf heuristics",
    targets: "Claude Code, Cursor, Gemini CLI, Neovim",
  },
  {
    cmd: "npx skills add shadcn/ui-skills",
    pkg: "shadcn/ui-skills@precision-components",
    title: "Precision UI Components & Controls",
    author: "shadcn",
    stars: "156k",
    rulesCount: "20 compact component schemas",
    targets: "Claude Code, Cursor, Codex, Copilot",
  },
  {
    cmd: "npx skills add dresar/prompting",
    pkg: "dresar/prompting@pure-orchestrator",
    title: "Master CLI Orchestrator Engine",
    author: "dresar",
    stars: "89k",
    rulesCount: "14 multi-CLI delegation protocols",
    targets: "Claude Code, Aider, Hermes, Gemini CLI",
  },
];

export function AgenticHero({
  locale,
  totalSkills,
  totalCategories,
}: AgenticHeroProps) {
  const isEn = locale === "en";
  const [copied, setCopied] = React.useState(false);
  const [commandIndex, setCommandIndex] = React.useState(0);
  const [charIndex, setCharIndex] = React.useState(0);
  const [executionStep, setExecutionStep] = React.useState(0);

  const activeCmdObj = TERMINAL_COMMANDS[commandIndex];

  React.useEffect(() => {
    let timer: NodeJS.Timeout;

    if (executionStep === 0) {
      if (charIndex < activeCmdObj.cmd.length) {
        timer = setTimeout(() => {
          setCharIndex((prev) => prev + 1);
        }, 85);
      } else {
        timer = setTimeout(() => {
          setExecutionStep(1);
        }, 850);
      }
    } else if (executionStep === 1) {
      timer = setTimeout(() => {
        setExecutionStep(2);
      }, 1000);
    } else if (executionStep === 2) {
      timer = setTimeout(() => {
        setExecutionStep(3);
      }, 950);
    } else if (executionStep === 3) {
      timer = setTimeout(() => {
        setExecutionStep(4);
      }, 950);
    } else if (executionStep === 4) {
      timer = setTimeout(() => {
        setExecutionStep(5);
      }, 1100);
    } else if (executionStep === 5) {
      timer = setTimeout(() => {
        setExecutionStep(0);
        setCharIndex(0);
        setCommandIndex((prev) => (prev + 1) % TERMINAL_COMMANDS.length);
      }, 6500);
    }

    return () => clearTimeout(timer);
  }, [charIndex, executionStep, activeCmdObj.cmd.length]);

  const displayedCommand = activeCmdObj.cmd.slice(0, charIndex);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCmdObj.cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full space-y-10 sm:space-y-14 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="lg:col-span-7 space-y-5 text-left"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] border border-border/80 bg-surface/80 text-[10px] sm:text-[11px] font-mono text-muted-foreground uppercase tracking-widest shadow-2xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              <AnimatedNumber value={totalSkills} suffix="+" /> {isEn ? "CURATED SKILLS FOR AI AGENTS" : "SKILL TERKURASI UNTUK AGEN AI"}
            </span>
          </motion.div>

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
            <motion.a
              href="#catalog"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-[6px] bg-foreground text-background font-semibold text-xs hover:opacity-90 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span>{isEn ? "Browse Skills" : "Jelajahi Skill"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.a>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={`/${locale}/skills/submit`}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-[6px] border border-border bg-surface text-foreground font-semibold text-xs hover:bg-muted transition-all shadow-2xs active:scale-95"
              >
                <span>{isEn ? "Submit Your Skill" : "Kirimkan Skill"}</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          whileHover={{ y: -2 }}
          className="lg:col-span-5"
        >
          <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-b from-[#0a0f1d] via-[#070b13] to-[#04070c] p-4 sm:p-5 text-xs font-mono shadow-[0_0_35px_-8px_rgba(6,182,212,0.15)] relative overflow-hidden text-zinc-300">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[10px] text-zinc-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="tracking-widest uppercase font-semibold text-zinc-200">
                  AGENT CLI TERMINAL
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[9px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ONLINE</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
            </div>

            <div className="space-y-2.5 text-[11px] leading-relaxed select-text min-h-[250px] sm:min-h-[270px]">
              <div className="flex items-center justify-between gap-2 p-2 rounded-[6px] bg-black/60 border border-white/10 shadow-inner">
                <span className="text-zinc-100 font-semibold font-mono truncate">
                  <span className="text-cyan-400 mr-1.5">$</span>
                  {displayedCommand}
                  <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-0.5 animate-pulse align-middle" />
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 rounded-[4px] text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-colors shrink-0 cursor-pointer active:scale-95"
                  title="Copy command"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="space-y-1.5 pt-1 font-mono text-[10px] sm:text-[11px]">
                {executionStep >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-2 text-zinc-400"
                  >
                    {executionStep === 1 ? (
                      <Loader2 className="w-3 h-3 text-cyan-400 animate-spin shrink-0" />
                    ) : (
                      <span className="text-emerald-400 font-bold">✓</span>
                    )}
                    <span>Resolving package registry {activeCmdObj.pkg}...</span>
                  </motion.div>
                )}

                {executionStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-0.5 pl-4 border-l border-white/10 text-zinc-400"
                  >
                    <div className="text-emerald-400 font-medium flex items-center gap-1.5">
                      <span>✓ Validated SKILL.md specification (v2.1 standard)</span>
                    </div>
                    <div className="text-zinc-500 text-[10px]">
                      Author: <span className="text-zinc-300">{activeCmdObj.author}</span> · Stars: <span className="text-amber-300">★ {activeCmdObj.stars}</span> · License: <span className="text-zinc-300">MIT</span>
                    </div>
                  </motion.div>
                )}

                {executionStep >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-2 text-zinc-300"
                  >
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Compiled {activeCmdObj.rulesCount} &amp; tool signatures</span>
                  </motion.div>
                )}

                {executionStep >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-1 pl-4 border-l border-cyan-500/30 text-zinc-400"
                  >
                    <div className="text-cyan-300 font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Injected instructions into agent runtimes:</span>
                    </div>
                    <div className="text-zinc-400 text-[10px] pl-1">
                      {activeCmdObj.targets}
                    </div>
                  </motion.div>
                )}

                {executionStep >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 pt-2 border-t border-white/10 space-y-1"
                  >
                    <div className="text-emerald-400 font-semibold flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Skill active and verified in runtime</span>
                      </div>
                      <span className="text-[9px] text-zinc-500 font-mono">0 warnings</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      $ npx skills status → <span className="text-cyan-300">{activeCmdObj.title}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="border-y border-border/80 divide-y sm:divide-y-0 sm:divide-x divide-border/80 grid grid-cols-2 sm:grid-cols-4 py-5 sm:py-6 text-center"
      >
        <div className="py-2 sm:py-0 px-4 space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
            <AnimatedNumber value={totalSkills} suffix="+" />
          </div>
          <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
            {isEn ? "CURATED SKILLS" : "SKILL TERKURASI"}
          </div>
        </div>

        <div className="py-2 sm:py-0 px-4 space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
            <AnimatedNumber value={totalCategories} />
          </div>
          <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
            {isEn ? "CATEGORIES" : "KATEGORI"}
          </div>
        </div>

        <div className="py-2 sm:py-0 px-4 space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
            <AnimatedNumber value={9} />
          </div>
          <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
            {isEn ? "PLATFORMS" : "PLATFORM"}
          </div>
        </div>

        <div className="py-2 sm:py-0 px-4 space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
            <AnimatedNumber value={100} suffix="%" />
          </div>
          <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
            {isEn ? "OPEN SOURCE" : "OPEN SOURCE"}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="space-y-3.5 border-b border-border/80 pb-5"
      >
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          <span className="font-semibold text-foreground">
            {isEn ? "OFFICIAL AGENT PLATFORMS" : "PLATFORM AGEN RESMI"}
          </span>
          <span className="hidden sm:inline text-cyan-500 font-semibold">
            {isEn ? "9 Supported Environments" : "9 Lingkungan Didukung"}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {PLATFORM_ITEMS.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.04 * idx }}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center justify-center p-2 rounded-[6px] border border-border/70 bg-surface/60 hover:border-cyan-500/40 hover:bg-muted/30 transition-all group cursor-pointer shadow-2xs"
            >
              <div className="w-6 h-6 relative shrink-0 mb-1.5 transition-transform duration-200 group-hover:scale-110">
                <Image
                  src={item.logo}
                  alt={item.name}
                  width={24}
                  height={24}
                  unoptimized
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>
              <span className="text-[10px] font-mono font-medium text-muted-foreground group-hover:text-foreground text-center truncate max-w-full">
                {item.name}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
