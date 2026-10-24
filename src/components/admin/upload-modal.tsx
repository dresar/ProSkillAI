"use client";

import * as React from "react";
import { X, UploadCloud, Copy, Check, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import type { MediaFileItem } from "@/app/admin/media/actions";

interface UploadFileQueueItem {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  status: "queued" | "uploading" | "success" | "error";
  error?: string;
  uploadedItem?: MediaFileItem;
}

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (items: MediaFileItem[]) => void;
  defaultFolder?: string;
}

export function UploadModal({
  open,
  onClose,
  onSuccess,
  defaultFolder = "skills",
}: UploadModalProps) {
  const [folder, setFolder] = React.useState(defaultFolder);
  const [queue, setQueue] = React.useState<UploadFileQueueItem[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!open) {
      setQueue([]);
      setIsProcessing(false);
    }
  }, [open]);

  const addFilesToQueue = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const newItems: UploadFileQueueItem[] = Array.from(fileList).map((file, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: "queued",
    }));

    setQueue((prev) => [...prev, ...newItems]);
  };

  const processQueue = async () => {
    if (isProcessing) return;
    const pending = queue.filter((item) => item.status === "queued");
    if (pending.length === 0) return;

    setIsProcessing(true);
    const completedItems: MediaFileItem[] = [];

    for (const item of pending) {
      setQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: "uploading", progress: 25 } : q))
      );

      const formData = new FormData();
      formData.append("folder", folder);
      formData.append("slug", "gallery");
      formData.append("files", item.file);

      try {
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, progress: 65 } : q))
        );

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || data?.error || !data?.images?.[0]) {
          throw new Error(data?.error || "Gagal mengunggah file.");
        }

        const uploaded = data.images[0];
        const mediaItem: MediaFileItem = {
          id: uploaded.id || `media-${Date.now()}`,
          name: uploaded.name || item.file.name,
          url: uploaded.url,
          cdnUrl: uploaded.cdnUrl || uploaded.url,
          rawUrl: uploaded.rawUrl || uploaded.url,
          path: uploaded.path,
          size: uploaded.size || item.file.size,
          updatedAt: new Date().toISOString(),
          folder,
        };

        completedItems.push(mediaItem);

        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? {
                  ...q,
                  status: "success",
                  progress: 100,
                  uploadedItem: mediaItem,
                }
              : q
          )
        );
      } catch (err) {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? {
                  ...q,
                  status: "error",
                  error: err instanceof Error ? err.message : "Upload gagal",
                  progress: 0,
                }
              : q
          )
        );
      }
    }

    setIsProcessing(false);
    if (completedItems.length > 0 && onSuccess) {
      onSuccess(completedItems);
    }
  };

  React.useEffect(() => {
    if (queue.some((item) => item.status === "queued") && !isProcessing) {
      void processQueue();
    }
  }, [queue, isProcessing]);

  const handleCopy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[8px] border border-border bg-surface shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-foreground" />
            <h3 className="text-xs font-bold text-foreground tracking-tight">
              Unggah Media & Sinkronisasi CDN
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-[4px] text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-foreground">Target Folder:</span>
              <select
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                disabled={isProcessing}
                className="h-8 px-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none"
              >
                <option value="skills">skills</option>
                <option value="prompts">prompts</option>
                <option value="ui">ui</option>
                <option value="general">general</option>
              </select>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-8 items-center gap-1.5 rounded-[6px] bg-foreground px-3.5 text-xs font-semibold text-background hover:opacity-90 active:scale-95 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Pilih Gambar</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
            className="hidden"
            onChange={(e) => addFilesToQueue(e.target.files)}
          />

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              addFilesToQueue(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border/80 hover:border-foreground/40 rounded-[8px] bg-muted/20 p-5 text-center cursor-pointer transition-colors"
          >
            <div className="flex flex-col items-center justify-center space-y-1 pointer-events-none">
              <UploadCloud className="w-6 h-6 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">
                Tarik & lepaskan file gambar ke sini (Mendukung banyak file sekaligus)
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                PNG, JPG, WEBP, SVG &middot; Otomatis tersimpan ke database & CDN GitHub
              </span>
            </div>
          </div>

          {queue.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <span className="text-[11px] font-semibold text-foreground">
                Antrean & Hasil Unggahan ({queue.length} file)
              </span>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-[6px] border border-border bg-background space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-10 h-10 rounded-[4px] bg-muted/30 overflow-hidden shrink-0 border border-border flex items-center justify-center">
                        <img
                          src={item.previewUrl}
                          alt={item.file.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-foreground truncate">
                          {item.file.name}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                          <span>{formatBytes(item.file.size)}</span>
                          <span>&middot;</span>
                          {item.status === "queued" && <span>Menunggu...</span>}
                          {item.status === "uploading" && (
                            <span className="inline-flex items-center gap-1 text-cyan-500">
                              <Loader2 className="w-2.5 h-2.5 animate-spin" />
                              Mengunggah...
                            </span>
                          )}
                          {item.status === "success" && (
                            <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Selesai
                            </span>
                          )}
                          {item.status === "error" && (
                            <span className="inline-flex items-center gap-1 text-rose-500 font-semibold">
                              <AlertCircle className="w-2.5 h-2.5" />
                              {item.error || "Gagal"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {item.status === "uploading" && (
                      <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-foreground transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}

                    {item.status === "success" && item.uploadedItem && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <input
                          type="text"
                          readOnly
                          value={item.uploadedItem.cdnUrl}
                          className="flex-1 h-7 px-2 font-mono text-[11px] rounded-[5px] border border-border bg-surface text-foreground select-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopy(item.uploadedItem!.cdnUrl, item.id)}
                          className="h-7 px-2.5 inline-flex items-center gap-1 rounded-[5px] bg-foreground text-background text-xs font-semibold hover:opacity-90 active:scale-95 cursor-pointer shadow-xs whitespace-nowrap"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10">
          <span className="text-[11px] font-mono text-muted-foreground">
            {isProcessing ? "Sedang memproses antrean..." : "Semua data otomatis tersinkronisasi."}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 rounded-[6px] bg-foreground text-background text-xs font-semibold hover:opacity-90 active:scale-95 cursor-pointer shadow-xs"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
