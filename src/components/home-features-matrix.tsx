import Link from "next/link";
import { Terminal, ShieldCheck, Cpu, Layers, ArrowRight, Check, X } from "lucide-react";

interface HomeFeaturesMatrixProps {
  locale: string;
}

export function HomeFeaturesMatrix({ locale }: HomeFeaturesMatrixProps) {
  const isEn = locale === "en";

  const pillars = [
    {
      icon: Terminal,
      title: isEn ? "1-Click CLI Installation" : "Instalasi 1-Klik CLI",
      desc: isEn
        ? "Install verified skills directly into your workspace via `npx skills add <author>/<slug>` with zero manual file copying."
        : "Pasang skill terverifikasi langsung ke repositori Anda lewat perintah `npx skills add <author>/<slug>` tanpa konfigurasi manual.",
      badge: "CLI v1.4",
    },
    {
      icon: ShieldCheck,
      title: isEn ? "Strict Safety & TDD Heuristics" : "Keamanan Ketat & Heuristik TDD",
      desc: isEn
        ? "Every module enforces isolated sandbox execution, zero secret leak policies, and autonomous test-driven verification."
        : "Setiap modul menerapkan eksekusi sandbox terisolasi, larangan hardcode rahasia/token, dan verifikasi alur kerja TDD.",
      badge: isEn ? "Verified" : "Terverifikasi",
    },
    {
      icon: Cpu,
      title: isEn ? "Universal Runtime Compatibility" : "Kompatibilitas Runtime Universal",
      desc: isEn
        ? "Works seamlessly across Claude Code, Cursor AI, OpenAI Codex, Antigravity, Windsurf, and Aider environments."
        : "Kompatibel penuh lintas lingkungan Claude Code, Cursor AI, OpenAI Codex, Antigravity, Windsurf, dan Aider.",
      badge: "Cross-Agent",
    },
    {
      icon: Layers,
      title: isEn ? "MCP & llms.txt Native" : "Dukungan Asli MCP & llms.txt",
      desc: isEn
        ? "Fully indexable by autonomous AI agents via `/llms.txt`, JSON-LD schemas, and Anthropic Model Context Protocol servers."
        : "Dapat diindeks langsung oleh agen AI otonom melalui protokol `/llms.txt`, skema JSON-LD, dan server Anthropic MCP.",
      badge: "Open Protocol",
    },
  ];

  const comparisonRows = [
    {
      dimension: isEn ? "Execution Environment" : "Lingkungan Eksekusi",
      prompt: isEn ? "Manual copy-paste into browser chat" : "Copy-paste manual ke jendela chat",
      skill: isEn ? "Direct workspace injection (.agents/skills/)" : "Injeksi otomatis ke workspace (.agents/skills/)",
    },
    {
      dimension: isEn ? "Context & Token Overhead" : "Beban Konteks & Token",
      prompt: isEn ? "Bloated prompts re-sent every turn" : "Prompt panjang dikirim ulang setiap pesan",
      skill: isEn ? "Lightweight on-demand activation" : "Aktivasi hemat token sesuai kebutuhan alur kerja",
    },
    {
      dimension: isEn ? "Tooling & File Access" : "Akses Tool & File Kode",
      prompt: isEn ? "Isolated text, no terminal execution" : "Teks terisolasi tanpa eksekusi terminal",
      skill: isEn ? "Full filesystem & terminal CLI tools" : "Didukung akses filesystem dan eksekusi tool CLI",
    },
    {
      dimension: isEn ? "Code Quality Heuristics" : "Standar Kualitas Kode",
      prompt: isEn ? "Generic AI slop with verbose comments" : "Sering menghasilkan komentar AI berlebihan",
      skill: isEn ? "Enforced zero-comment & clean TDD code" : "Menegakkan clean code tanpa komentar dan TDD ketat",
    },
    {
      dimension: isEn ? "Autonomous Iteration" : "Iterasi Otonom",
      prompt: isEn ? "Requires manual developer guidance" : "Memerlukan bimbingan manual langkah demi langkah",
      skill: isEn ? "Multi-step verification & auto-retry loops" : "Otomatis melakukan verifikasi build dan auto-retry",
    },
  ];

  return (
    <section aria-labelledby="features-matrix-heading" className="w-full space-y-10">
      <div className="space-y-2 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[6px] border border-border bg-surface text-[11px] font-mono text-muted-foreground">
          <span>{isEn ? "ENGINEERING STANDARD" : "STANDAR REKAYASA"}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>
        <h2
          id="features-matrix-heading"
          className="text-lg sm:text-2xl font-bold tracking-tight text-foreground"
        >
          {isEn
            ? "Why Modern Teams Use AI Agent Skills Instead of Prompts"
            : "Mengapa Tim Rekayasa Menggunakan Skill Agen AI, Bukan Sekadar Prompt"}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {isEn
            ? "Standard prompt templates only guide conversation. AI Agent Skills provide structured instruction packages, automated CLI commands, and reproducible engineering pipelines directly inside your local developer workspace."
            : "Templat prompt biasa hanya memandu percakapan teks. Skill Agen AI menyediakan paket instruksi terstruktur, perintah CLI otomatis, dan alur rekayasa berulang langsung di dalam workspace lokal developer Anda."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {pillars.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-xl border border-border bg-surface hover:border-foreground/30 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-[6px] bg-foreground text-background flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-muted text-muted-foreground border border-border/60">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              {isEn ? "Architectural Comparison Matrix" : "Matriks Perbandingan Arsitektur"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEn
                ? "Factual breakdown between ad-hoc chat prompting and ProSkillAI autonomous skills."
                : "Perbandingan faktual antara prompt obrolan biasa dan skill otonom ProSkillAI."}
            </p>
          </div>
          <Link
            href={`/${locale}/skills`}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold tracking-tight shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <span>{isEn ? "Explore Registry" : "Jelajahi Registry"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-mono text-[11px]">
                <th className="py-2.5 px-4 font-medium w-1/3">
                  {isEn ? "Capability" : "Fitur & Kapabilitas"}
                </th>
                <th className="py-2.5 px-4 font-medium w-1/3">
                  {isEn ? "Generic Chat Prompts" : "Prompt Obrolan Biasa"}
                </th>
                <th className="py-2.5 px-4 font-medium w-1/3 text-foreground">
                  {isEn ? "ProSkillAI Curated Skills" : "Skill Terkurasi ProSkillAI"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/15 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">
                    {row.dimension}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    <div className="flex items-start gap-1.5">
                      <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{row.prompt}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-foreground font-medium">
                    <div className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{row.skill}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
