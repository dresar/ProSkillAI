"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Sparkles, Send, Bot, User as UserIcon, X, Zap, LogIn, Copy, Check, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import type { PublicUser } from "./public-user-nav";
import { MarkdownRenderer } from "./markdown-renderer";

interface SkillAiChatProps {
  skillId: string;
  skillTitle: string;
  skillSummary?: string;
  locale: string;
  user: PublicUser | null;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  modelUsed?: string;
  createdAt: Date;
}

export function SkillAiChat({
  skillId,
  skillTitle,
  skillSummary,
  locale,
  user,
}: SkillAiChatProps) {
  const isEn = locale === "en";
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [credits, setCredits] = React.useState<number>(user?.aiCredits ?? 10);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = React.useState<string | null>(null);

  const endOfChatRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (user) {
      fetch("/api/ai/credits")
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.credits === "number") {
            setCredits(data.credits);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  React.useEffect(() => {
    if (messages.length > 0) {
      endOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const quickPrompts = isEn
    ? [
        `How do I install and configure this skill?`,
        `Explain the core architecture and workflow`,
        `Give a practical usage example for my project`,
      ]
    : [
        `Bagaimana cara pasang dan konfigurasi skill ini?`,
        `Jelaskan arsitektur dan alur kerja intinya`,
        `Berikan contoh penggunaan praktis untuk project saya`,
      ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSend = async (questionText?: string) => {
    const textToSend = (questionText || input).trim();
    if (!textToSend || isLoading) return;

    if (!user) {
      setErrorMsg(
        isEn
          ? "Please sign in to ask the AI assistant."
          : "Silakan masuk ke akun untuk bertanya kepada asisten AI."
      );
      return;
    }

    if (credits <= 0) {
      setErrorMsg(
        isEn
          ? "Your AI credits have run out (0/10). Please contact an admin."
          : "Kredit AI Anda telah habis (0/10). Hubungi admin untuk isi ulang."
      );
      return;
    }

    setErrorMsg(null);
    setInput("");

    const userMsg: ChatMessage = {
      id: "u-" + Date.now(),
      role: "user",
      content: textToSend,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/skill-ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId,
          question: textToSend,
          locale,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.message || (isEn ? "Failed to get response" : "Gagal mendapatkan respon"));
      }

      const assistantMsg: ChatMessage = {
        id: "a-" + Date.now(),
        role: "assistant",
        content: data.answer,
        modelUsed: data.modelUsed,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (typeof data.remainingCredits === "number") {
        setCredits(data.remainingCredits);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || (isEn ? "Failed to process AI query" : "Gagal memproses pertanyaan AI"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8">
        <div className="relative group">
          <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-[6px] bg-foreground text-background text-xs font-semibold whitespace-nowrap shadow-lg hidden sm:flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{isEn ? "Ask AI about this Skill" : "Tanya AI tentang Skill Ini"}</span>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => setIsOpen(true)}
            aria-label={isEn ? "Ask AI about this Skill" : "Tanya AI tentang Skill Ini"}
            className="w-12 h-12 rounded-full border border-border/80 bg-foreground text-background shadow-xl hover:opacity-95 transition-shadow flex items-center justify-center cursor-pointer relative"
          >
            <Bot className="w-5 h-5 text-background" />
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
            </span>
          </motion.button>
        </div>
      </div>

      {isOpen && mounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="skill-ai-modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-lg sm:max-w-xl h-[85vh] max-h-[640px] flex flex-col rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-border/80 bg-muted/20 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-[6px] bg-foreground text-background flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-background" />
                </div>
                <div className="min-w-0">
                  <h2
                    id="skill-ai-modal-title"
                    className="text-xs font-semibold text-foreground tracking-tight truncate flex items-center gap-1.5"
                  >
                    <span>{isEn ? "Ask AI:" : "Tanya AI:"} {skillTitle}</span>
                  </h2>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {isEn ? "Full SKILL.md & auxiliary files loaded" : "Seluruh SKILL.md & berkas pendukung aktif"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {user ? (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] border border-border text-[11px] font-mono font-semibold bg-background">
                    <Zap className={`w-3 h-3 ${credits > 0 ? "text-amber-500 fill-amber-400" : "text-muted-foreground"}`} />
                    <span>{credits}/10</span>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold border border-amber-500/20">
                    10 {isEn ? "credits" : "kredit"}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-[6px] border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
                  aria-label={isEn ? "Close dialog" : "Tutup dialog"}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!user ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-muted/10">
                <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center text-foreground">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-sm font-semibold text-foreground">
                    {isEn ? "Member-Exclusive AI Assistant" : "Asisten AI Khusus Member"}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isEn
                      ? "Sign in to receive 10 free AI credits to ask technical questions about this skill."
                      : "Masuk ke akun Anda untuk mendapatkan 10 kredit gratis untuk bertanya secara mendalam tentang skill ini."}
                  </p>
                </div>
                <Link
                  href={`/login?redirect=/${locale}/skills`}
                  className="inline-flex items-center gap-1.5 h-8 px-4 rounded-[6px] bg-foreground text-background text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isEn ? "Sign In to Ask AI" : "Masuk untuk Tanya AI"}</span>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                  {messages.length === 0 && (
                    <div className="space-y-4 text-center py-4">
                      <div className="w-10 h-10 rounded-full bg-foreground/5 mx-auto flex items-center justify-center">
                        <Bot className="w-5 h-5 text-foreground" />
                      </div>
                      <div className="space-y-1 max-w-sm mx-auto">
                        <p className="text-xs font-semibold text-foreground">
                          {isEn ? `Ready to explore ${skillTitle}` : `Siap menganalisis ${skillTitle}`}
                        </p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {isEn
                            ? "Ask anything about implementation, rules, or practical agent commands."
                            : "Tanyakan apapun seputar instruksi implementasi, aturan, maupun perintah agen."}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 max-w-md mx-auto pt-2 text-left">
                        {quickPrompts.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => handleSend(q)}
                            disabled={isLoading || credits <= 0}
                            className="text-left text-xs p-2.5 rounded-[8px] border border-border/80 bg-background hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-between gap-2 group"
                          >
                            <span className="text-foreground group-hover:underline underline-offset-2">
                              {q}
                            </span>
                            <Sparkles className="w-3 h-3 text-muted-foreground group-hover:text-amber-500 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((m) => {
                    const isUser = m.role === "user";
                    const isCopied = copiedMsgId === m.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        {!isUser && (
                          <div className="w-7 h-7 rounded-[6px] bg-foreground text-background flex items-center justify-center shrink-0 mt-0.5">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                        )}

                        <div
                          className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                            isUser
                              ? "bg-foreground text-background rounded-tr-xs"
                              : "bg-surface border border-border text-foreground rounded-tl-xs shadow-2xs space-y-2"
                          }`}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap">{m.content}</p>
                          ) : (
                            <div>
                              <MarkdownRenderer content={m.content} />
                              <div className="flex items-center justify-between gap-2 pt-2 mt-2 border-t border-border/60 text-[10px] text-muted-foreground">
                                <span className="font-mono">
                                  {m.modelUsed || "proskill-ai"}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(m.content, m.id)}
                                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-500" />
                                      <span className="text-emerald-500">{isEn ? "Copied" : "Disalin"}</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>{isEn ? "Copy" : "Salin"}</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {isUser && (
                          <div className="w-7 h-7 rounded-[6px] bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5 text-foreground">
                            <UserIcon className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex gap-2.5 justify-start">
                      <div className="w-7 h-7 rounded-[6px] bg-foreground text-background flex items-center justify-center shrink-0">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="p-3 rounded-xl rounded-tl-xs bg-surface border border-border text-xs flex items-center gap-2 text-muted-foreground shadow-2xs">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-foreground" />
                        <span>{isEn ? "Analyzing skill context..." : "Menganalisis konteks dokumentasi..."}</span>
                      </div>
                    </div>
                  )}

                  <div ref={endOfChatRef} />
                </div>

                {errorMsg && (
                  <div className="px-4 py-2 border-t border-rose-500/30 bg-rose-500/10 text-rose-500 text-xs shrink-0">
                    {errorMsg}
                  </div>
                )}

                <div className="p-3 sm:p-4 border-t border-border/80 bg-background/50 space-y-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading || credits <= 0}
                      placeholder={
                        credits <= 0
                          ? isEn
                            ? "AI credits limit reached (0/10)"
                            : "Kredit AI habis (0/10)"
                          : isEn
                          ? `Ask about ${skillTitle}...`
                          : `Tanyakan seputar ${skillTitle}...`
                      }
                      className="flex-1 h-9 px-3 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground disabled:opacity-50"
                    />

                    <button
                      type="button"
                      onClick={() => handleSend()}
                      disabled={isLoading || !input.trim() || credits <= 0}
                      className="h-9 px-3.5 rounded-[6px] bg-foreground text-background text-xs font-semibold hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                    >
                      {isLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span className="hidden sm:inline">{isEn ? "Ask" : "Kirim"}</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-muted-foreground text-center">
                    {isEn
                      ? "1 credit per question · Full SKILL.md documentation and sub-skills loaded"
                      : "1 kredit per pertanyaan · Konteks lengkap dokumentasi SKILL.md terkirim otomatis"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
