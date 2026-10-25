"use client";

import * as React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface HomeFaqSectionProps {
  locale: string;
}

export function HomeFaqSection({ locale }: HomeFaqSectionProps) {
  const isEn = locale === "en";
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqItems = [
    {
      question: isEn
        ? "What is ProSkillAI and how does it work?"
        : "Apa itu ProSkillAI dan bagaimana cara kerjanya?",
      answerLead: isEn
        ? "ProSkillAI is an open-source curated directory and package registry for production-grade AI agent skills compatible with Claude Code, Cursor, Codex, and Antigravity. Each skill is packaged under the standard SKILL.md specification with verified heuristics, allowing 1-click terminal installation via `npx skills add` without manual copy-pasting."
        : "ProSkillAI adalah direktori dan package registry terbuka untuk skill agen AI siap produksi yang kompatibel dengan Claude Code, Cursor, OpenAI Codex, dan Antigravity. Setiap modul dikemas dalam spesifikasi standar SKILL.md dengan heuristik terverifikasi, memungkinkan instalasi 1-klik melalui perintah `npx skills add` tanpa perlu copy-paste manual.",
      answerDetails: isEn
        ? "Unlike ordinary prompts, skills define project context, tool execution boundaries, TDD pipelines, and Model Context Protocol (MCP) servers. Once installed, your AI agent reads the instructions locally and executes complex multi-step workflows autonomously."
        : "Berbeda dari sekadar prompt obrolan, skill mendefinisikan konteks codebase, batasan eksekusi tool, alur kerja TDD, dan konfigurasi server Model Context Protocol (MCP). Setelah terpasang di direktori .agents/skills/, agen AI Anda membaca instruksi secara lokal dan menjalankan tugas rekayasa secara otonom.",
    },
    {
      question: isEn
        ? "How do I install a skill into Claude Code, Cursor, or Codex?"
        : "Bagaimana cara memasang skill ke Claude Code, Cursor, atau Codex?",
      answerLead: isEn
        ? "You install any skill by running `npx skills add <author>/<slug>` directly inside your project repository root terminal. The CLI automatically downloads the SKILL.md specification, dependencies, and configuration files into your local `.agents/skills/` directory without altering unrelated files."
        : "Anda dapat memasang skill dengan menjalankan perintah `npx skills add <author>/<slug>` langsung di terminal repositori proyek Anda. CLI akan mengunduh spesifikasi SKILL.md, dependensi, dan file konfigurasi ke dalam direktori lokal `.agents/skills/` tanpa menyentuh file proyek lain.",
      answerDetails: isEn
        ? "You can also install skills globally or copy the raw SKILL.md file directly into your workspace. Antigravity and Claude Code automatically detect and activate installed skills based on the active coding context."
        : "Anda juga dapat memasang skill secara global atau menyalin file SKILL.md langsung ke workspace Anda. Claude Code, Antigravity, dan Cursor otomatis mendeteksi dan mengaktifkan skill sesuai dengan konteks tugas koding yang sedang dikerjakan.",
    },
    {
      question: isEn
        ? "Are skills on ProSkillAI safe for commercial production codebases?"
        : "Apakah skill di ProSkillAI aman untuk codebase produksi komersial?",
      answerLead: isEn
        ? "Yes. All skills published on ProSkillAI undergo automated AST validation and strict security checks. Every module enforces zero secret leakage rules, prohibits hardcoded credentials, and operates strictly within developer-approved sandbox boundaries."
        : "Ya. Seluruh skill yang dipublikasikan di ProSkillAI melalui validasi AST otomatis dan pemeriksaan keamanan ketat. Setiap modul menerapkan larangan hardcode token/kredensial, menjaga privasi data lokal, dan beroperasi di dalam batasan sandbox kerja developer.",
      answerDetails: isEn
        ? "Skills are transparent, plain-text markdown specifications that you can inspect before installation. There are no hidden binaries or obfuscated scripts."
        : "Setiap skill berbentuk dokumen teks transparan (Markdown) yang dapat Anda audit sepenuhnya sebelum dijalankan. Tidak ada binary tersembunyi atau skrip terenkripsi.",
    },
    {
      question: isEn
        ? "How does ProSkillAI differ from traditional prompt marketplaces?"
        : "Apa perbedaan ProSkillAI dengan marketplace prompt biasa?",
      answerLead: isEn
        ? "Traditional prompt marketplaces sell conversational text snippets meant for single-turn browser chats. ProSkillAI provides structured autonomous engineering skills that include multi-step verification, strict clean code rules, TDD loops, and Model Context Protocol (MCP) tool integration."
        : "Marketplace prompt biasa menjual teks instruksi obrolan untuk jendela chat browser. Sebaliknya, ProSkillAI menyediakan skill rekayasa otonom terstruktur yang mencakup verifikasi langkah bertahap, standar clean code tanpa komentar berlebih, alur pengujian TDD, dan integrasi server MCP.",
      answerDetails: isEn
        ? "Our skills turn AI coding assistants into disciplined senior engineers that follow your architectural standards rather than generating generic AI slop."
        : "Skill ProSkillAI membimbing AI coding assistant agar bersikap seperti senior engineer disiplin yang mematuhi arsitektur sistem Anda, bukan sekadar menghasilkan kode generik berantakan.",
    },
    {
      question: isEn
        ? "How much does ProSkillAI cost to use?"
        : "Berapa biaya penggunaan ProSkillAI?",
      answerLead: isEn
        ? "ProSkillAI is 100% free and open-source under the MIT license. There are no subscription fees, download quotas, or paywalled documentation for accessing any published skill, prompt template, or Model Context Protocol server."
        : "ProSkillAI 100% gratis dan open source di bawah lisensi MIT. Tidak ada biaya langganan, batasan unduhan, atau paywall dokumentasi untuk mengakses seluruh koleksi skill, templat prompt, dan server MCP.",
      answerDetails: isEn
        ? "You can freely use, fork, and adapt any skill in your private commercial codebases or open-source projects without licensing fees."
        : "Anda bebas menggunakan, memodifikasi, dan mengadaptasi seluruh skill di codebase komersial privat maupun proyek open source tanpa biaya royalti.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${item.answerLead} ${item.answerDetails}`,
      },
    })),
  };

  return (
    <section aria-labelledby="faq-section-heading" className="w-full space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="space-y-2 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[6px] border border-border bg-surface text-[11px] font-mono text-muted-foreground">
          <HelpCircle className="w-3.5 h-3.5 text-foreground" />
          <span>{isEn ? "KNOWLEDGE BASE & FAQ" : "FAQ & BASIS PENGETAHUAN"}</span>
        </div>
        <h2
          id="faq-section-heading"
          className="text-lg sm:text-2xl font-bold tracking-tight text-foreground"
        >
          {isEn
            ? "Frequently Asked Questions About AI Agent Skills"
            : "Pertanyaan yang Sering Diajukan Seputar Skill Agen AI"}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {isEn
            ? "Essential answers for engineering teams and AI search engines regarding specifications, security, and runtime installation."
            : "Jawaban esensial bagi tim developer dan mesin pencari AI mengenai spesifikasi, keamanan, dan instalasi runtime."}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface divide-y divide-border/60 overflow-hidden">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="transition-colors">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/20 transition-colors"
              >
                <span className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                  {item.question}
                </span>
                <span className="w-6 h-6 rounded-[4px] border border-border bg-background flex items-center justify-center shrink-0 text-muted-foreground">
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-foreground" : ""
                    }`}
                  />
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-muted-foreground space-y-2 animate-in fade-in duration-150">
                  <p className="font-medium text-foreground leading-relaxed">
                    {item.answerLead}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.answerDetails}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
