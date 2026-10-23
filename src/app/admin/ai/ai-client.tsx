"use client";

import * as React from "react";
import {
  Bot,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Key,
  Globe,
  Users,
  Copy,
  Check,
  ShieldCheck,
  Radio,
} from "lucide-react";
import type { AiConfig, AiModelItem } from "@/lib/ai";

interface AdminAiClientProps {
  initialConfig: AiConfig;
  models: AiModelItem[];
  stats: {
    totalUsers: number;
    totalCredits: number;
  };
}

export function AdminAiClient({ initialConfig, models, stats }: AdminAiClientProps) {
  const [config, setConfig] = React.useState<AiConfig>(initialConfig);
  const [activeModel, setActiveModel] = React.useState<string>(initialConfig.defaultModel);
  const [search, setSearch] = React.useState("");
  const [filterType, setFilterType] = React.useState<"all" | "free" | "flash" | "flagship">("all");
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const [testingModelId, setTestingModelId] = React.useState<string | null>(null);
  const [testResults, setTestResults] = React.useState<Record<string, { success: boolean; latencyMs: number; message: string }>>({});

  const [isResetting, setIsResetting] = React.useState(false);
  const [resetMsg, setResetMsg] = React.useState<string | null>(null);
  const [copiedKey, setCopiedKey] = React.useState(false);

  const freeModelsCount = models.filter((m) => m.isFree).length;

  const filteredModels = models.filter((m) => {
    const matchesSearch =
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.name.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === "free") return m.isFree;
    if (filterType === "flash") return !m.isFree && m.inputPrice < 1;
    if (filterType === "flagship") return m.inputPrice >= 1;
    return true;
  });

  const handleSelectModel = async (modelId: string) => {
    setActiveModel(modelId);
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/ai/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: {
            ...config,
            defaultModel: modelId,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {}
    setIsSaving(false);
  };

  const handleTestModel = async (modelId: string) => {
    setTestingModelId(modelId);
    try {
      const res = await fetch("/api/ai/test-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelId }),
      });
      const data = await res.json();
      setTestResults((prev) => ({
        ...prev,
        [modelId]: {
          success: Boolean(data.success),
          latencyMs: data.latencyMs ?? 0,
          message: data.message ?? "Unknown",
        },
      }));
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [modelId]: {
          success: false,
          latencyMs: 0,
          message: err?.message || "Failed to reach model",
        },
      }));
    } finally {
      setTestingModelId(null);
    }
  };

  const handleResetCredits = async () => {
    if (!confirm("Reset kuota kredit tanya AI untuk semua akun pengguna ke 10 kredit?")) {
      return;
    }

    setIsResetting(true);
    setResetMsg(null);

    try {
      const res = await fetch("/api/ai/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_credits", amount: 10 }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetMsg(data.message || "Semua kredit berhasil direset ke 10.");
      } else {
        setResetMsg("Gagal mereset kredit.");
      }
    } catch {
      setResetMsg("Terjadi kesalahan.");
    } finally {
      setIsResetting(false);
      setTimeout(() => setResetMsg(null), 4000);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(config.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            <Bot className="w-3.5 h-3.5 text-foreground" />
            <span>AI Gateway &amp; Router Control</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Manajemen Model AI &amp; Kuota Pengguna
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kelola model ByNara Router, uji latensi model gratisan, dan monitor distribusi kredit tanya AI.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetCredits}
            disabled={isResetting}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground text-xs font-medium transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isResetting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-amber-500" />}
            <span>Reset Kuota User (10 Kredit)</span>
          </button>
        </div>
      </div>

      {resetMsg && (
        <div className="p-3 rounded-[6px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{resetMsg}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-3 rounded-[6px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Pengaturan model aktif berhasil diperbarui &amp; disimpan ke database!</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-border bg-surface space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Model Aktif Saat Ini
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground font-mono truncate">{activeModel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>Aktif melayani tanya jawab skill</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Model Gratisan (IDR 0)
          </span>
          <div className="text-xl font-bold text-foreground font-mono">{freeModelsCount} Model</div>
          <p className="text-[11px] text-muted-foreground">Termasuk MiniMax, Nemotron, Laguna</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Total Pengguna Terdaftar
          </span>
          <div className="text-xl font-bold text-foreground font-mono">{stats.totalUsers} Akun</div>
          <p className="text-[11px] text-muted-foreground">Total kredit aktif: {stats.totalCredits} kuota</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Sistem Cadangan (Fallback)
          </span>
          <div className="text-xs font-semibold text-foreground font-mono">Sumopod DeepSeek Netra</div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Otomatis aktif jika ByNara 502/down</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border bg-surface space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Konfigurasi Endpoint &amp; Kredensial Tetap (Hardcoded)</span>
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-foreground text-background">
            Active Provider
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-[6px] border border-border bg-background space-y-1">
            <span className="text-[10px] text-muted-foreground block">BASE ENDPOINT URL</span>
            <div className="flex items-center justify-between gap-2 text-foreground font-semibold">
              <span className="truncate">{config.endpoint}</span>
              <span className="text-[10px] text-emerald-500 font-sans">OpenAI Compatible</span>
            </div>
          </div>

          <div className="p-2.5 rounded-[6px] border border-border bg-background space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">API KEY</span>
              <button
                type="button"
                onClick={handleCopyKey}
                className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {copiedKey ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey ? "Tersalin" : "Salin Key"}</span>
              </button>
            </div>
            <div className="flex items-center justify-between gap-2 text-foreground font-semibold">
              <span className="truncate">
                {config.apiKey
                  ? `${config.apiKey.slice(0, 8)}...${config.apiKey.slice(-4)}`
                  : "Terkonfigurasi via .env"}
              </span>
              <span className="text-[10px] text-muted-foreground font-sans">Verified</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-lg border border-border bg-muted/40 text-xs">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`px-3 py-1 rounded-[5px] font-medium transition-all cursor-pointer ${
                filterType === "all" ? "bg-surface text-foreground font-semibold shadow-2xs" : "text-muted-foreground"
              }`}
            >
              Semua ({models.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("free")}
              className={`px-3 py-1 rounded-[5px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                filterType === "free" ? "bg-surface text-foreground font-semibold shadow-2xs" : "text-muted-foreground"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Gratis / Free ({freeModelsCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterType("flash")}
              className={`px-3 py-1 rounded-[5px] font-medium transition-all cursor-pointer ${
                filterType === "flash" ? "bg-surface text-foreground font-semibold shadow-2xs" : "text-muted-foreground"
              }`}
            >
              Flash / Hemat
            </button>
            <button
              type="button"
              onClick={() => setFilterType("flagship")}
              className={`px-3 py-1 rounded-[5px] font-medium transition-all cursor-pointer ${
                filterType === "flagship" ? "bg-surface text-foreground font-semibold shadow-2xs" : "text-muted-foreground"
              }`}
            >
              Flagship Pro
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari model ID..."
              className="w-full h-8 pl-8 pr-3 rounded-[6px] border border-border bg-surface text-foreground text-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredModels.map((m) => {
            const isSelected = m.id === activeModel;
            const testResult = testResults[m.id];
            const isTesting = testingModelId === m.id;

            return (
              <div
                key={m.id}
                className={`p-3.5 rounded-xl border transition-all space-y-3 ${
                  isSelected
                    ? "border-foreground bg-foreground/5 shadow-xs"
                    : "border-border bg-surface hover:border-border/80"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-foreground truncate">{m.name}</h3>
                    <p className="text-[10px] font-mono text-muted-foreground truncate">{m.id}</p>
                  </div>

                  {m.isFree ? (
                    <span className="shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 rounded-[4px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      GRATIS / FREE
                    </span>
                  ) : (
                    <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                      IDR {m.inputPrice}/1k
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1 border-t border-border/60">
                  <span>In: IDR {m.inputPrice}</span>
                  <span>Out: IDR {m.outputPrice}</span>
                  {m.contextWindow ? <span>Ctx: {Math.round(m.contextWindow / 1000)}k</span> : null}
                </div>

                {testResult && (
                  <div
                    className={`p-2 rounded-[5px] text-[10px] font-mono border ${
                      testResult.success
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{testResult.success ? "STATUS: ONLINE" : "STATUS: RESPON ERROR"}</span>
                      <span>{testResult.latencyMs}ms</span>
                    </div>
                    <p className="truncate mt-0.5 text-[9px]">{testResult.message}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelectModel(m.id)}
                    disabled={isSelected || isSaving}
                    className={`flex-1 h-7 rounded-[5px] text-[11px] font-medium transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? "bg-foreground text-background font-semibold cursor-default"
                        : "border border-border bg-background hover:bg-muted text-foreground"
                    }`}
                  >
                    {isSelected ? <Check className="w-3 h-3" /> : null}
                    <span>{isSelected ? "Model Aktif" : "Pilih Model"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTestModel(m.id)}
                    disabled={isTesting}
                    title="Uji koneksi langsung ke model ini"
                    className="h-7 px-2.5 rounded-[5px] border border-border bg-background hover:bg-muted text-foreground text-[11px] font-medium transition-all active:scale-95 cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
                  >
                    {isTesting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-amber-500" />}
                    <span>Uji</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}