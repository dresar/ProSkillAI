"use client";

import * as React from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  X,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Award,
} from "lucide-react";
import type { AiAuditResult } from "@/lib/ai";

interface AiAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: "prompt" | "skill";
  title: string;
  description: string;
  content: string;
  files?: Array<{ name: string; content: string; language?: string }>;
}

export function AiAuditModal({
  isOpen,
  onClose,
  targetType,
  title,
  description,
  content,
  files,
}: AiAuditModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<AiAuditResult | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const runAudit = React.useCallback(async () => {
    if (!title.trim() || !content.trim()) {
      setErrorMsg("Harap isi judul dan konten terlebih dahulu sebelum menjalankan audit.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/ai/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          title,
          description,
          content,
          files,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Gagal melakukan audit AI");
      }

      setResult(data.result);
    } catch (err: any) {
      setErrorMsg(err?.message || "Terjadi kendala saat menghubungkan ke mesin audit AI.");
    } finally {
      setLoading(false);
    }
  }, [targetType, title, description, content, files]);

  React.useEffect(() => {
    if (isOpen && !result && !loading) {
      runAudit();
    }
  }, [isOpen, result, loading, runAudit]);

  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 70) return "text-blue-500 border-blue-500/30 bg-blue-500/10";
    if (score >= 55) return "text-amber-500 border-amber-500/30 bg-amber-500/10";
    return "text-rose-500 border-rose-500/30 bg-rose-500/10";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[5px] bg-foreground/10 text-foreground flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-1.5">
                <span>Audit Kualitas & Keamanan AI</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-border bg-background uppercase">
                  {targetType}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={runAudit}
              disabled={loading}
              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[5px] border border-border bg-background hover:bg-muted text-xs font-medium text-foreground transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
              <span>Audit Ulang</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-[5px] text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-foreground/80" />
              <div className="space-y-1">
                <p className="font-medium text-foreground">Sedang Menganalisis dengan AI...</p>
                <p className="text-muted-foreground text-[11px]">
                  Memeriksa struktur instruksi, variabel, celah keamanan, dan efektivitas.
                </p>
              </div>
            </div>
          )}

          {errorMsg && !loading && (
            <div className="p-3.5 rounded-[6px] border border-rose-500/40 bg-rose-500/10 text-rose-500 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>Gagal Melakukan Audit</span>
              </div>
              <p className="leading-relaxed">{errorMsg}</p>
              <button
                type="button"
                onClick={runAudit}
                className="h-6 px-2.5 rounded-[4px] bg-rose-500 text-white font-medium text-[11px] hover:opacity-90 cursor-pointer"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {result && !loading && (
            <>
              <div className="p-4 rounded-lg border border-border bg-background/50 flex items-center justify-between gap-4 flex-wrap">
                <div className="space-y-1 flex-1 min-w-[200px]">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                    Penilaian Eksekutif
                  </span>
                  <p className="text-foreground leading-relaxed">{result.summary}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-1.5 rounded-lg border font-mono flex items-center gap-2 ${getScoreColor(
                      result.score
                    )}`}
                  >
                    <Award className="w-4 h-4" />
                    <div className="text-right">
                      <div className="text-base font-bold leading-none">{result.score}/100</div>
                      <div className="text-[10px] opacity-80 uppercase">Grade {result.grade}</div>
                    </div>
                  </div>
                </div>
              </div>

              {result.warnings && result.warnings.length > 0 && (
                <div className="p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/5 space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Potensi Masalah & Catatan Kritis ({result.warnings.length})</span>
                  </div>
                  <ul className="space-y-1.5 pl-5 list-disc text-foreground/90 leading-relaxed text-[11px]">
                    {result.warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.recommendations && result.recommendations.length > 0 && (
                <div className="p-3.5 rounded-lg border border-blue-500/30 bg-blue-500/5 space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Rekomendasi Perbaikan Konkret ({result.recommendations.length})</span>
                  </div>
                  <ul className="space-y-1.5 pl-5 list-disc text-foreground/90 leading-relaxed text-[11px]">
                    {result.recommendations.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.strengths && result.strengths.length > 0 && (
                <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Kekuatan & Aspek Positif ({result.strengths.length})</span>
                  </div>
                  <ul className="space-y-1.5 pl-5 list-disc text-foreground/90 leading-relaxed text-[11px]">
                    {result.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground font-mono">
            Powered by DeepMind Security & Prompt Engine
          </span>
          <button
            type="button"
            onClick={onClose}
            className="h-7 px-3 rounded-[5px] bg-foreground text-background text-xs font-medium hover:opacity-90 transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
