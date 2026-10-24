"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Copy, Terminal } from "lucide-react";
import { motion } from "motion/react";

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
    const duration = 1200;
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

const TERMINAL_COMMANDS = [
  {
    cmd: "npx skills add Leonxlnx/taste-skill",
    pkg: "Leonxlnx/taste-skill@frontend-taste",
    title: "Installed Taste Skill",
    meta: "⭐ 101k · Design Systems",
  },
  {
    cmd: "npx skills add obra/superpowers",
    pkg: "obra/superpowers@autonomous-tdd",
    title: "Installed Superpowers",
    meta: "⭐ 304k · Engineering Agent",
  },
  {
    cmd: "npx skills add anthropic/frontend",
    pkg: "anthropic/frontend@design-mastery",
    title: "Installed Frontend Skill",
    meta: "⭐ 183k · Official Guide",
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
  const [displayedCommand, setDisplayedCommand] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(true);
  const [showResult, setShowResult] = React.useState(false);

  const activeCmdObj = TERMINAL_COMMANDS[commandIndex];

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    const fullCmd = activeCmdObj.cmd;

    if (isTyping) {
      if (displayedCommand.length < fullCmd.length) {
        timeout = setTimeout(() => {
          setDisplayedCommand(fullCmd.slice(0, displayedCommand.length + 1));
        }, 38);
      } else {
        setIsTyping(false);
        timeout = setTimeout(() => {
          setShowResult(true);
        }, 300);
      }
    } else if (showResult) {
      timeout = setTimeout(() => {
        setShowResult(false);
        setDisplayedCommand("");
        setIsTyping(true);
        setCommandIndex((prev) => (prev + 1) % TERMINAL_COMMANDS.length);
      }, 4200);
    }

    return () => clearTimeout(timeout);
  }, [displayedCommand, isTyping, showResult, activeCmdObj.cmd]);

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
          <div className="rounded-xl border border-white/10 bg-[#070b13] p-4 sm:p-5 text-xs font-mono shadow-2xl relative overflow-hidden text-zinc-300">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[10px] text-zinc-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="tracking-widest uppercase font-semibold text-zinc-200">
                  AGENT CLI TERMINAL
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
            </div>

            <div className="space-y-2 text-[11px] leading-relaxed select-text min-h-[160px]">
              <div className="flex items-center justify-between gap-2 p-1.5 rounded bg-black/40 border border-white/10">
                <span className="text-zinc-100 font-semibold font-mono truncate">
                  $ {displayedCommand}
                  <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-0.5 animate-pulse align-middle" />
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                  title="Copy command"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {showResult && (
                <div className="space-y-1.5 pt-1 animate-in fade-in duration-200">
                  <p className="text-zinc-500 text-[10px]">
                    Resolving package {activeCmdObj.pkg}...
                  </p>
                  <p className="text-emerald-400 font-medium text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{activeCmdObj.title}</span>
                    <span className="text-zinc-500 text-[10px] font-mono">({activeCmdObj.meta})</span>
                  </p>
                  <p className="text-zinc-400 text-[10px]">
                    Syncing instructions to Claude, Cursor &amp; Codex runtime...
                  </p>

                  <div className="pt-2 text-zinc-100 font-semibold text-[10px]">$ npx skills list</div>
                  <ul className="space-y-0.5 text-zinc-300 text-[10px] pl-1 font-mono">
                    <li className="text-cyan-300">✓ {activeCmdObj.cmd.split("add ")[1]}</li>
                    <li className="text-zinc-400">• superpowers <span className="text-zinc-600">(⭐ 304k · Architecture)</span></li>
                    <li className="text-zinc-400">• anthropic-frontend <span className="text-zinc-600">(⭐ 183k · Standards)</span></li>
                  </ul>
                </div>
              )}
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
          {PLATFORM_ITEMS.map((item) => (
            <div
              key={item.name}
              className="flex flex-col items-center justify-center p-2 rounded-lg border border-border/70 bg-surface/60 hover:border-foreground/30 hover:bg-muted/30 transition-all group cursor-pointer"
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
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}