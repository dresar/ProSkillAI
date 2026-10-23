"use client";

import * as React from "react";
import { updateFeatureFlagsAction, updateSidebarPromptsAction } from "./actions";
import { Save, Check, Sparkles, SlidersHorizontal, CheckSquare, Square } from "lucide-react";

interface PromptItem {
  id: string;
  slug: string;
  titleId: string;
  titleEn: string;
  categoryName?: string | null;
}

interface SettingsClientProps {
  initialFlags: Record<string, boolean>;
  initialSidebarPromptIds?: string[];
  availablePrompts?: PromptItem[];
}

export function SettingsClient({
  initialFlags,
  initialSidebarPromptIds = [],
  availablePrompts = [],
}: SettingsClientProps) {
  const [flags, setFlags] = React.useState(initialFlags);
  const [selectedPromptIds, setSelectedPromptIds] = React.useState<string[]>(initialSidebarPromptIds);
  const [isSavingFlags, setIsSavingFlags] = React.useState(false);
  const [savedFlags, setSavedFlags] = React.useState(false);
  const [isSavingPrompts, setIsSavingPrompts] = React.useState(false);
  const [savedPrompts, setSavedPrompts] = React.useState(false);

  const toggleFlag = (key: string) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePrompt = (id: string) => {
    setSelectedPromptIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSaveFlags = async () => {
    setIsSavingFlags(true);
    setSavedFlags(false);
    await updateFeatureFlagsAction(flags);
    setIsSavingFlags(false);
    setSavedFlags(true);
    setTimeout(() => setSavedFlags(false), 3000);
  };

  const handleSaveSidebarPrompts = async () => {
    setIsSavingPrompts(true);
    setSavedPrompts(false);
    await updateSidebarPromptsAction(selectedPromptIds);
    setIsSavingPrompts(false);
    setSavedPrompts(true);
    setTimeout(() => setSavedPrompts(false), 3000);
  };

  const flagItems = [
    { key: "teardowns", label: "Teardowns Arsitektur", desc: "Aktifkan rute dan katalog modul Teardowns" },
    { key: "patterns", label: "Pola Desain AI", desc: "Aktifkan rute dan katalog modul Patterns" },
    { key: "guides", label: "Panduan & Buku Pegangan", desc: "Aktifkan rute dan katalog modul Guides" },
    { key: "glossary", label: "Glosarium Istilah", desc: "Aktifkan rute dan glosarium istilah AI" },
    { key: "tools", label: "Katalog Alat & Ekstensi", desc: "Aktifkan direktori perkakas dan MCP server" },
    { key: "inspirations", label: "Inspirasi UI", desc: "Aktifkan galeri inspirasi antarmuka" },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-foreground" />
              <span>Sidebar Banner Detail Skill</span>
            </div>
            <h2 className="text-base font-semibold text-foreground tracking-tight">
              Pilihan Prompt Sidebar (Pustaka Prompt AI)
            </h2>
            <p className="text-xs text-muted-foreground">
              Pilih prompt dari database untuk ditampilkan di banner sidebar halaman detail skill. Jika tidak ada yang dipilih, sistem otomatis menampilkan 3 prompt terbaru.
            </p>
          </div>

          <button
            type="button"
            disabled={isSavingPrompts}
            onClick={handleSaveSidebarPrompts}
            className="inline-flex items-center gap-1.5 h-8 px-4 rounded-[6px] text-xs font-semibold bg-foreground text-background hover:opacity-90 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs self-start sm:self-auto shrink-0"
          >
            {savedPrompts ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedPrompts ? "Tersimpan!" : isSavingPrompts ? "Menyimpan..." : "Simpan Pilihan Prompt"}</span>
          </button>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              Daftar Prompt Publik Terverifikasi ({availablePrompts.length})
            </span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-muted text-foreground border border-border">
              Terpilih: {selectedPromptIds.length} prompt
            </span>
          </div>

          {availablePrompts.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">
              Belum ada prompt dengan status published di database.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {availablePrompts.map((p) => {
                const isSelected = selectedPromptIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePrompt(p.id)}
                    className={`flex items-start gap-2.5 p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-foreground bg-foreground/5 shadow-2xs"
                        : "border-border/80 bg-background hover:bg-muted/40"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0 text-foreground">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-foreground" />
                      ) : (
                        <Square className="w-4 h-4 text-muted-foreground/60" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-xs font-semibold text-foreground truncate">
                          {p.titleId}
                        </span>
                        {p.categoryName && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/50 shrink-0">
                            {p.categoryName}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground font-mono truncate">
                        {p.slug}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-foreground" />
              <span>Feature Flags</span>
            </div>
            <h2 className="text-base font-semibold text-foreground tracking-tight">
              Pengaturan Fitur & Modul Beta
            </h2>
            <p className="text-xs text-muted-foreground">
              Kendali fitur flag internal. Saat dinonaktifkan, modul hanya berstatus beta pada halaman beranda dan rute publik tetap terlindungi.
            </p>
          </div>

          <button
            type="button"
            disabled={isSavingFlags}
            onClick={handleSaveFlags}
            className="inline-flex items-center gap-1.5 h-8 px-4 rounded-[6px] text-xs font-semibold bg-foreground text-background hover:opacity-90 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs self-start sm:self-auto shrink-0"
          >
            {savedFlags ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedFlags ? "Tersimpan!" : isSavingFlags ? "Menyimpan..." : "Simpan Pengaturan"}</span>
          </button>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface space-y-4">
          <h3 className="text-xs font-semibold text-foreground tracking-tight pb-2 border-b border-border">
            Status Modul Rilis Mendatang
          </h3>

          <div className="space-y-2.5">
            {flagItems.map((item) => {
              const isEnabled = Boolean(flags[item.key]);
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30 text-xs"
                >
                  <div>
                    <div className="font-semibold text-foreground">{item.label}</div>
                    <div className="text-[11px] text-muted-foreground">{item.desc}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFlag(item.key)}
                    className={`h-6 px-3 rounded-[5px] text-[11px] font-semibold border transition-colors cursor-pointer ${
                      isEnabled
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isEnabled ? "Aktif" : "Nonaktif (Beta)"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
