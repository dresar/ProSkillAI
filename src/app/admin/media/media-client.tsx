"use client";

import * as React from "react";
import { UploadCloud, Copy, Check, Trash2, Search, X, Image as ImageIcon, AlertCircle, ExternalLink } from "lucide-react";
import { deleteMediaAction, type MediaFileItem } from "./actions";

interface MediaClientProps {
  initialItems: MediaFileItem[];
}

export function MediaClient({ initialItems }: MediaClientProps) {
  const [items, setItems] = React.useState<MediaFileItem[]>(initialItems);
  const [search, setSearch] = React.useState("");
  const [targetFolder, setTargetFolder] = React.useState("skills");
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [copiedType, setCopiedType] = React.useState<string | null>(null);
  const [previewItem, setPreviewItem] = React.useState<MediaFileItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const filteredItems = React.useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (item) => item.name.toLowerCase().includes(q) || item.folder.toLowerCase().includes(q)
    );
  }, [items, search]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("folder", targetFolder);
    formData.append("slug", "gallery");
    for (let i = 0; i < Math.min(files.length, 5); i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data?.error) {
        setUploadError(data?.error || "Gagal mengunggah gambar.");
      } else if (data?.images) {
        const newMedia: MediaFileItem[] = data.images.map((img: any, idx: number) => ({
          id: `new-${Date.now()}-${idx}`,
          name: img.path.split("/").pop() || "image.png",
          url: img.path,
          cdnUrl: img.cdnUrl || img.url,
          rawUrl: img.rawUrl || img.url,
          path: img.path.replace(/^\/+/, "").replace(/^public\//, ""),
          size: 0,
          updatedAt: new Date().toISOString(),
          folder: targetFolder,
        }));
        setItems((prev) => [...newMedia, ...prev]);
      }
    } catch {
      setUploadError("Gagal menghubungi server upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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
    await deleteMediaAction(item.path);
    setConfirmDeleteId(null);
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return "—";
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

        <div className="flex items-center gap-2">
          <select
            value={targetFolder}
            onChange={(e) => setTargetFolder(e.target.value)}
            className="h-8 px-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none"
          >
            <option value="skills">Folder: skills</option>
            <option value="prompts">Folder: prompts</option>
            <option value="ui">Folder: ui</option>
            <option value="general">Folder: general</option>
          </select>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex h-8 items-center gap-1.5 rounded-[6px] bg-foreground px-3.5 text-xs font-semibold text-background hover:opacity-90 active:scale-95 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{isUploading ? "Mengunggah..." : "Unggah"}</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 rounded-[6px] border border-rose-500/30 bg-rose-500/10 text-rose-500 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border/80 hover:border-foreground/40 rounded-[8px] bg-surface/50 p-6 text-center cursor-pointer transition-colors"
      >
        <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
          <ImageIcon className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">
            Tarik & lepaskan file gambar ke sini atau klik untuk memilih
          </span>
          <span className="text-[11px] text-muted-foreground font-mono">
            PNG, JPG, WEBP, SVG hingga 5MB &middot; Otomatis dibuatkan tautan CDN GitHub
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama file media..."
            className="w-full h-8 pl-8 pr-3 rounded-[6px] border border-border bg-surface text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-[8px] border border-border bg-surface overflow-hidden flex flex-col justify-between hover:border-foreground/30 transition-all shadow-2xs"
            >
              <div
                onClick={() => setPreviewItem(item)}
                className="relative aspect-square w-full bg-muted/20 cursor-pointer overflow-hidden flex items-center justify-center p-2"
              >
                <img
                  src={item.url}
                  alt={item.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
                <span className="absolute top-1.5 left-1.5 px-1 py-0.2 rounded bg-background/90 text-[9px] font-mono border border-border text-muted-foreground">
                  {item.folder}
                </span>
              </div>

              <div className="p-2.5 space-y-2 border-t border-border/80">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-medium text-foreground truncate" title={item.name}>
                    {item.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    {formatBytes(item.size)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopyCdn(item)}
                    className="h-7 inline-flex items-center justify-center gap-1 rounded-[5px] border border-border bg-background text-[11px] font-medium text-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-muted-foreground" />
                        <span>Salin CDN</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(item.id)}
                    className="h-7 inline-flex items-center justify-center gap-1 rounded-[5px] border border-border bg-background text-[11px] font-medium text-rose-500 hover:bg-rose-500/10 active:scale-95 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
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

            <div className="relative aspect-video w-full bg-muted/20 rounded-[6px] overflow-hidden flex items-center justify-center p-2">
              <img
                src={previewItem.url}
                alt={previewItem.name}
                className="max-h-full max-w-full object-contain"
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
                    className="h-7 px-2.5 inline-flex items-center gap-1 rounded-[5px] bg-foreground text-background text-xs font-semibold hover:opacity-90 active:scale-95 cursor-pointer"
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
                    className="h-7 px-2.5 inline-flex items-center gap-1 rounded-[5px] border border-border bg-background text-foreground text-xs font-medium hover:bg-muted active:scale-95 cursor-pointer"
                  >
                    {copiedType === "raw" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedType === "raw" ? "Tersalin" : "Salin"}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-foreground">Path Lokal Project:</span>
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
                    className="h-7 px-2.5 inline-flex items-center gap-1 rounded-[5px] border border-border bg-background text-foreground text-xs font-medium hover:bg-muted active:scale-95 cursor-pointer"
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
              Hapus file gambar ini secara permanen dari penyimpanan server?
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
    </div>
  );
}
