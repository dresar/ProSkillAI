"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Send, Bot, User as UserIcon, AlertCircle, LogIn, RefreshCw, Zap } from "lucide-react";
import type { PublicUser } from "./public-user-nav";
import { MarkdownRenderer } from "./markdown-renderer";

interface SkillAiChatProps {
  skillId: string;
  skillTitle: string;
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
  locale,
  user,
}: SkillAiChatProps) {
  const isEn = locale === "en";
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [credits, setCredits] = React.useState<number>(user?.aiCredits ?? 5);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const endOfChatRef = React.useRef<HTMLDivElement>(null);

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
        `How do I install this skill?`,
        `Give a practical usage example`,
        `What are the best practices?`,
      ]
    : [
        `Bagaimana cara pasang skill ini?`,
        `Berikan contoh penggunaan praktis`,
        `Apa saja praktik terbaiknya?`,
      ];

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
          ? "Your AI credits have run out (0/5). Please contact an admin."
          : "Kredit AI Anda telah habis (0/5). Hubungi admin untuk isi ulang."
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
    <section
      aria-labelledby="ai-chat-heading"
      className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs transition-colors"
    >
      <div className="p-4 border-b border-border/80 bg-muted/20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-[6px] bg-foreground text-background flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 id="ai-chat-heading" className="text-xs font-semibold text-foreground tracking-tight flex items-center gap-1.5">
              <span>{isEn ? "Ask AI about this Skill" : "Tanya AI tentang Skill Ini"}</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono bg-foreground/10 text-foreground">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Smart</span>
              </span>
            </h2>
            <p className="text-[10px] text-muted-foreground truncate">
              {isEn ? "Context-aware AI assistant powered by ByNara Router" : "Asisten AI kontekstual bertenaga ByNara Router"}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          {user ? (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] border border-border text-[11px] font-mono font-medium bg-background">
              <Zap className={`w-3 h-3 ${credits > 0 ? "text-amber-500 fill-amber-400" : "text-muted-foreground"}`} />
              <span>{credits}/5</span>
              <span className="text-[10px] text-muted-foreground">{isEn ? "credits" : "kredit"}</span>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-medium border border-amber-500/20">
              5 {isEn ? "free credits" : "kredit gratis"}
            </span>
          )}
        </div>
      </div>

      {!user && (
        <div className="p-4 sm:p-5 text-center space-y-3 bg-muted/10">
          <div className="w-10 h-10 rounded-full bg-foreground/5 mx-auto flex items-center justify-center text-foreground">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-xs font-semibold text-foreground">
              {isEn ? "Member-Exclusive Feature" : "Fitur Eksklusif Pengguna"}
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {isEn
                ? "Sign in to get 5 free AI credits to ask detailed technical questions about this skill."
                : "Masuk ke akun Anda untuk mendapatkan 5 kredit gratis untuk bertanya secara mendalam tentang skill ini."}
            </p>
          </div>
          <Link
            href={`/login?redirect=/${locale}/skills`}
            className="inline-flex items-center gap-1.5 h-8 px-4 rounded-[6px] bg-foreground text-background text-xs font-medium hover:opacity-90 active:scale-95 transition-all shadow-xs"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{isEn ? "Sign In to Ask AI" : "Masuk untuk Tanya AI"}</span>
          </Link>
        </div>
      )}

      {user && (
        <div className="p-4 sm:p-5 space-y-4">
          {messages.length === 0 && (
            <div className="space-y-3 text-center py-2">
              <p className="text-xs text-muted-foreground">
                {isEn
                  ? `Ask anything about ${skillTitle}. Answers are tailored directly from its official code & instructions.`
                  : `Tanyakan apa saja tentang ${skillTitle}. Jawaban disusun langsung dari kode & instruksi resminya.`}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading || credits <= 0}
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-[6px] border border-border bg-background hover:bg-muted text-foreground transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.length > 0 && (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-6 h-6 rounded-[5px] bg-foreground text-background flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-xs ${
                      m.role === "user"
                        ? "bg-foreground text-background font-medium"
                        : "bg-muted/50 border border-border/80 text-foreground"
                    }`}
                  >
                    {m.role === "user" ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                    ) : (
                      <div className="space-y-1">
                        <MarkdownRenderer content={m.content} />
                        {m.modelUsed && (
                          <div className="pt-2 mt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                            <span>via {m.modelUsed}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {m.role === "user" && (
                    <div className="w-6 h-6 rounded-[5px] bg-muted border border-border text-foreground flex items-center justify-center shrink-0 mt-0.5">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{isEn ? "AI is analyzing the skill documentation..." : "AI sedang menganalisis dokumentasi skill..."}</span>
                </div>
              )}

              <div ref={endOfChatRef} />
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 rounded-[6px] border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2 border-t border-border/80">
            {credits <= 0 ? (
              <div className="p-2.5 rounded-[6px] border border-border bg-muted/40 text-center space-y-1">
                <p className="text-xs font-semibold text-foreground">
                  {isEn ? "AI Credit Limit Reached (0/5)" : "Batas Kredit AI Tercapai (0/5)"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {isEn
                    ? "You have used your 5 free credits for this session. Contact admin for additional allowance."
                    : "Anda telah menggunakan 5 kuota kredit gratis Anda. Hubungi admin untuk penambahan kuota."}
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isEn
                      ? `Ask a question about ${skillTitle}...`
                      : `Ajukan pertanyaan tentang ${skillTitle}...`
                  }
                  disabled={isLoading}
                  className="flex-1 h-9 px-3 rounded-[6px] border border-border bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-[6px] bg-foreground text-background text-xs font-medium hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 cursor-pointer shadow-xs"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{isEn ? "Ask" : "Tanya"}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}