"use client";

import * as React from "react";
import { UploadCloud, Copy, Check, Trash2, Search, X, Image as ImageIcon, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { deleteMediaAction, cleanOrphanedMediaAction, getUploadedMediaList, type MediaFileItem } from "./actions";
import { UploadModal } from "@/components/admin/upload-modal";

interface MediaClientProps {
  initialItems: MediaFileItem[];
}

export function MediaClient({ initialItems }: MediaClientProps) {
  const [items, setItems] = React.useState<MediaFileItem[]>(initialItems);
  const [search, setSearch] = React.useState("");
  const [targetFolder, setTargetFolder] = React.useState("all");
  const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [copiedType, setCopiedType] = React.useState<string | null>(null);
  const [previewItem, setPreviewItem] = React.useState<MediaFileItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  const [isCleaning, setIsCleaning] = React.useState(false);
  const [cleanMessage, setCleanMessage] = React.useState<string | null>(null);

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      const matchesFolder = targetFolder === "all" || item.folder.toLowerCase() === targetFolder.toLowerCase();
      const matchesSearch = !search.trim() || item.name.toLowerCase().includes(search.toLowerCase());
      return matchesFolder && matchesSearch;
    });
  }, [items, targetFolder, search]);

  const copyToClipboard = async (text: string, identifier: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(identifier);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {}
  };

  const handleCopyCdn = async (item: MediaFileItem) => {
    try {
      await navigator.clipboard.writeText(item.cdnUrl || item.rawUrl || item.url);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const handleDelete = async (item: MediaFileItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    await deleteMediaAction(item.id || item.path);
    setConfirmDeleteId(null);
  };

  const handleCleanOrphans = async () => {
    setIsCleaning(true);
    setCleanMessage(null);
    try {
      const res = await cleanOrphanedMediaAction();
      const updated = await getUploadedMediaList();
      setItems(updated);
      setCleanMessage(`Pembersihan selesai: ${res.deletedFiles} file dan ${res.deletedRecords} data yatim dibersihkan.`);
      setTimeout(() => setCleanMessage(null), 4000);
    } catch {
      setCleanMessage("Pembersihan gagal dilakukan.");
    } finally {
      setIsCleaning(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Pustaka Media & CDN GitHub
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Penyimpanan gambar publik yang disinkronkan langsung ke CDN GitHub (jsDelivr & Raw).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            disabled={isCleaning}
            onClick={handleCleanOrphans}
            className="inline-flex h-8 items-center gap-1.5 rounded-[6px] border border-border bg-surface px-3 text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            title="Hapus file atau data yang tidak sinkron antara disk dan database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCleaning ? "animate-spin" : ""}`} />
            <span>{isCleaning ? "Membersihkan..." : "Bersihkan Yatim"}</span>
          </button>

          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex h-8 items-center gap-1.5 rounded-[6px] bg-foreground px-3.5 text-xs font-semibold text-background hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Unggah Media</span>
          </button>
        </div>
      </div>

      {cleanMessage && (
        <div className="p-3 rounded-[6px] border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{cleanMessage}</span>
        </div>
      )}

      <div
        onClick={() => setUploadModalOpen(true)}
        className="border-2 border-dashed border-border/80 hover:border-foreground/40 rounded-[8px] bg-surface/50 p-6 text-center cursor-pointer transition-colors"
      >
        <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
          <ImageIcon className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">
            Klik untuk membuka jendela unggah multi-gambar dengan antrean realtime
          </span>
          <span className="text-[11px] text-muted-foreground font-mono">
            PNG, JPG, WEBP, SVG &middot; Multi-file &middot; Langsung siap salin CDN
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama file media..."
              className="w-full h-8 pl-8 pr-3 rounded-[6px] border border-border bg-surface text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <select
            value={targetFolder}
            onChange={(e) => setTargetFolder(e.target.value)}
            className="h-8 px-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none font-mono"
          >
            <option value="all">Semua Folder</option>
            <option value="skills">skills</option>
            <option value="prompts">prompts</option>
            <option value="ui">ui</option>
            <option value="general">general</option>
          </select>
        </div>

        <span className="text-xs text-muted-foreground font-mono self-end sm:self-auto">
          {filteredItems.length} file media
        </span>
      </div>

      {filteredItems.length === 0 ? (
        <div className="p-8 text-center rounded-[8px] border border-border bg-surface text-xs text-muted-foreground">
          Belum ada media gambar yang diunggah.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-[8px] border border-border bg-surface overflow-hidden flex flex-col justify-between hover:border-foreground/40 transition-all shadow-2xs"
            >
              <div
                onClick={() => setPreviewItem(item)}
                className="relative aspect-square w-full cursor-pointer overflow-hidden bg-background"
              >
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <div className="p-2.5 space-y-2 border-t border-border/80">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-semibold text-foreground truncate" title={item.name}>
                    {item.name}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                    <span>{item.folder}</span>
                    <span>{formatBytes(item.size)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopyCdn(item)}
                    className="flex-1 h-8 inline-flex items-center justify-center gap-1.5 rounded-[6px] border border-border bg-background text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer whitespace-nowrap shadow-2xs"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Salin CDN</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(item.id)}
                    className="h-8 px-2.5 inline-flex items-center justify-center gap-1 rounded-[6px] border border-border bg-background text-xs font-medium text-rose-500 hover:bg-rose-500/10 active:scale-95 transition-all cursor-pointer whitespace-nowrap shadow-2xs"
                    title="Hapus Media"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {previewItem && (
        <div className="fixed inset-0 z-50 bg-background/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-[8px] border border-border bg-surface p-4 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-semibold text-foreground truncate">{previewItem.name}</span>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-background rounded-[6px] overflow-hidden flex items-center justify-center">
              <img
                src={previewItem.url}
                alt={previewItem.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-foreground">CDN jsDelivr (GitHub):</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={previewItem.cdnUrl}
                    className="flex-1 h-7 px-2 font-mono text-[11px] rounded-[5px] border border-border bg-background text-foreground select-all"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(previewItem.cdnUrl, "cdn")}
                    className="h-7 px-2.5 inline-flex items-center gap-1 rounded-[5px] bg-foreground text-background text-xs font-semibold hover:opacity-90 active:scale-95 cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    {copiedType === "cdn" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedType === "cdn" ? "Tersalin" : "Salin"}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-foreground">GitHub Raw URL:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={previewItem.rawUrl}
                    className="flex-1 h-7 px-2 font-mono text-[11px] rounded-[5px] border border-border bg-background text-foreground select-all"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(previewItem.rawUrl, "raw")}
                    className="h-7 px-2.5 inline-flex items-center gap-1 rounded-[5px] border border-border bg-background text-foreground text-xs font-medium hover:bg-muted active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    {copiedType === "raw" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedType === "raw" ? "Tersalin" : "Salin"}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-foreground">Path Lokal:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={previewItem.url}
                    className="flex-1 h-7 px-2 font-mono text-[11px] rounded-[5px] border border-border bg-background text-foreground select-all"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(previewItem.url, "local")}
                    className="h-7 px-2.5 inline-flex items-center gap-1 rounded-[5px] border border-border bg-background text-foreground text-xs font-medium hover:bg-muted active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    {copiedType === "local" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedType === "local" ? "Tersalin" : "Salin"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-border gap-2">
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="h-7 px-3 rounded-[5px] border border-border text-xs text-foreground hover:bg-muted cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[8px] border border-border bg-surface p-5 space-y-4 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-rose-500">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-foreground">Hapus Media</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hapus file gambar ini secara permanen dari penyimpanan server dan database?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="h-8 px-3 rounded-[6px] border border-border text-xs text-foreground hover:bg-muted cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = items.find((i) => i.id === confirmDeleteId);
                  if (target) handleDelete(target);
                }}
                className="h-8 px-3 rounded-[6px] bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <UploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={(newItems) => {
          setItems((prev) => [...newItems, ...prev]);
        }}
      />
    </div>
  );
}
