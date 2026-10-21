"use client";

import * as React from "react";
import { updateFeatureFlagsAction } from "./actions";
import { Save, Check } from "lucide-react";

interface SettingsClientProps {
  initialFlags: Record<string, boolean>;
}

export function SettingsClient({ initialFlags }: SettingsClientProps) {
  const [flags, setFlags] = React.useState(initialFlags);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const toggleFlag = (key: string) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    await updateFeatureFlagsAction(flags);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Pengaturan Fitur & Modul Beta
          </h2>
          <p className="text-xs text-neutral-500">
            Kendali fitur flag internal. Saat dinonaktifkan, modul hanya berstatus beta pada halaman beranda dan rute publik tetap terlindungi.
          </p>
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 h-8 px-4 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          <span>{saved ? "Tersimpan!" : isSaving ? "Menyimpan..." : "Simpan Pengaturan"}</span>
        </button>
      </div>

      <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface space-y-4">
        <h3 className="text-xs font-semibold text-foreground tracking-tight pb-2 border-b border-neutral-200 dark:border-neutral-800">
          Status Modul Rilis Mendatang
        </h3>

        <div className="space-y-3">
          {flagItems.map((item) => {
            const isEnabled = Boolean(flags[item.key]);
            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 text-xs"
              >
                <div>
                  <div className="font-semibold text-foreground">{item.label}</div>
                  <div className="text-[11px] text-neutral-500">{item.desc}</div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFlag(item.key)}
                  className={`h-6 px-3 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                    isEnabled
                      ? "border-foreground bg-foreground text-background"
                      : "border-neutral-300 dark:border-neutral-700 bg-surface text-neutral-500"
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
  );
}
