"use client";

import * as React from "react";
import Image from "next/image";
import { ImagePlus, Link2, Loader2, Star, X } from "lucide-react";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  folder: "skills" | "prompts";
  slug: string;
  label?: string;
  endpoint?: string;
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024;

export function ImageUploader({
  value,
  onChange,
  max = 5,
  folder,
  slug,
  label = "Galeri Gambar",
  endpoint = "/api/upload",
}: ImageUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [urlInput, setUrlInput] = React.useState("");

  const remaining = Math.max(0, max - value.length);

  const uploadFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setError(null);

    if (remaining <= 0) {
      setError(`Maksimal ${max} gambar sudah tercapai.`);
      return;
    }

    const accepted = files.slice(0, remaining);
    if (files.length > remaining) {
      setError(`Hanya ${remaining} slot tersisa; ${files.length - remaining} file diabaikan.`);
    }

    for (const file of accepted) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Format gambar harus PNG, JPG, WEBP, atau GIF.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError("Ukuran setiap gambar maksimal 5 MB.");
        return;
      }
    }

    const formData = new FormData();
    for (const file of accepted) formData.append("files", file);
    formData.append("folder", folder);
    formData.append("slug", slug || "misc");

    setUploading(true);
    try {
      const response = await fetch(endpoint, { method: "POST", body: formData });
      const data = (await response.json()) as {
        images?: Array<{ url: string }>;
        error?: string;
      };
      if (!response.ok) {
        setError(data.error || "Upload gagal.");
        return;
      }
      const urls = (data.images || []).map((image) => image.url);
      onChange([...value, ...urls].slice(0, max));
    } catch {
      setError("Tidak dapat menghubungi server upload.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const makeCover = (index: number) => {
    if (index === 0) return;
    const next = [...value];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  };

  const addUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("invalid");
    } catch {
      setError("URL gambar tidak valid.");
      return;
    }
    if (value.includes(trimmed)) {
      setError("URL sudah ada di galeri.");
      return;
    }
    if (remaining <= 0) {
      setError(`Maksimal ${max} gambar sudah tercapai.`);
      return;
    }
    onChange([...value, trimmed]);
    setUrlInput("");
    setError(null);
  };

  return (
    <div className="space-y-2">
      <input type="hidden" name="imagesJson" value={JSON.stringify(value)} />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        <span className="text-[10px] text-muted-foreground">
          {value.length}/{max}
        </span>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void uploadFiles(event.dataTransfer.files);
        }}
        className={`rounded-lg border border-dashed p-3 text-center transition-colors ${
          dragging ? "border-foreground bg-muted/60" : "border-border bg-muted/20"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files) void uploadFiles(event.target.files);
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || remaining <= 0}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-border bg-surface hover:bg-muted disabled:opacity-50 cursor-pointer"
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ImagePlus className="w-3.5 h-3.5" />
          )}
          <span>{uploading ? "Mengunggah..." : "Pilih / Seret Gambar"}</span>
        </button>
        <p className="mt-1.5 text-[10px] text-muted-foreground">
          PNG, JPG, WEBP, GIF &middot; maks 5 MB &middot; sisa {remaining} slot
        </p>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative aspect-video rounded-lg border border-border bg-muted overflow-hidden group"
            >
              <Image
                src={url}
                alt={`Gambar ${index + 1}`}
                fill
                unoptimized
                sizes="200px"
                className="object-cover"
              />
              {index === 0 && (
                <span className="absolute top-1 left-1 text-[9px] px-1.5 py-0.5 rounded bg-foreground text-background font-semibold">
                  Cover
                </span>
              )}
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => makeCover(index)}
                    title="Jadikan cover"
                    className="p-1 rounded bg-background/90 text-foreground hover:bg-background cursor-pointer"
                  >
                    <Star className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  title="Hapus gambar"
                  className="p-1 rounded bg-background/90 text-foreground hover:bg-background cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <Link2 className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <input
            type="url"
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            placeholder="Tempel URL gambar (CDN)"
            className="w-full h-7 pl-6 pr-2 text-[11px] rounded border border-border bg-surface text-foreground"
          />
        </div>
        <button
          type="button"
          onClick={addUrl}
          className="h-7 px-2 rounded border border-border bg-surface hover:bg-muted text-[11px] cursor-pointer"
        >
          Tambah URL
        </button>
      </div>

      {error && <p className="text-[10px] text-red-500 leading-relaxed">{error}</p>}
    </div>
  );
}
