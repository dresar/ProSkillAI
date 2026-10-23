"use client";

import * as React from "react";
import {
  FileCode,
  Plus,
  Trash2,
  Upload,
  FileText,
  AlertCircle,
  Code,
  FileSpreadsheet,
} from "lucide-react";
import type { SkillFileItem } from "@/db/schema";

interface SkillFilesManagerProps {
  files: SkillFileItem[];
  onChange: (files: SkillFileItem[]) => void;
  maxFiles?: number;
  readOnly?: boolean;
}

function detectLanguage(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "ts":
    case "tsx":
      return "typescript";
    case "js":
    case "jsx":
    case "mjs":
    case "cjs":
      return "javascript";
    case "py":
      return "python";
    case "sh":
    case "bash":
    case "zsh":
      return "bash";
    case "json":
      return "json";
    case "yml":
    case "yaml":
      return "yaml";
    case "md":
    case "markdown":
      return "markdown";
    case "css":
      return "css";
    case "html":
      return "html";
    case "sql":
      return "sql";
    default:
      return "text";
  }
}

export function SkillFilesManager({
  files,
  onChange,
  maxFiles = 10,
  readOnly = false,
}: SkillFilesManagerProps) {
  const [activeFileId, setActiveFileId] = React.useState<string | null>(
    files[0]?.id || null
  );
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (files.length > 0 && (!activeFileId || !files.some((f) => f.id === activeFileId))) {
      setActiveFileId(files[0].id);
    } else if (files.length === 0) {
      setActiveFileId(null);
    }
  }, [files, activeFileId]);

  const handleAddBlankFile = () => {
    if (files.length >= maxFiles) {
      setErrorMsg(`Maksimal ${maxFiles} berkas per skill.`);
      return;
    }
    setErrorMsg(null);
    const newIndex = files.length + 1;
    const defaultName = `file-${newIndex}.sh`;
    const newFile: SkillFileItem = {
      id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: defaultName,
      content: "#!/usr/bin/env bash\n\n",
      language: "bash",
      size: 20,
    };
    const updated = [...files, newFile];
    onChange(updated);
    setActiveFileId(newFile.id);
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setErrorMsg(null);
    const availableSlots = maxFiles - files.length;
    if (availableSlots <= 0) {
      setErrorMsg(`Maksimal ${maxFiles} berkas sudah tercapai.`);
      return;
    }

    const filesToProcess = Array.from(selectedFiles).slice(0, availableSlots);
    const newItems: SkillFileItem[] = [];

    for (const file of filesToProcess) {
      if (file.size > 200 * 1024) {
        setErrorMsg(`Berkas "${file.name}" melebihi batas 200 KB.`);
        continue;
      }

      try {
        const text = await file.text();
        newItems.push({
          id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          content: text,
          language: detectLanguage(file.name),
          size: file.size,
        });
      } catch {
        setErrorMsg(`Gagal membaca berkas "${file.name}".`);
      }
    }

    if (newItems.length > 0) {
      const merged = [...files, ...newItems].slice(0, maxFiles);
      onChange(merged);
      setActiveFileId(newItems[0].id);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdateFile = (id: string, updates: Partial<SkillFileItem>) => {
    const updated = files.map((f) => {
      if (f.id === id) {
        const merged = { ...f, ...updates };
        if (updates.name && !updates.language) {
          merged.language = detectLanguage(updates.name);
        }
        if (typeof updates.content === "string") {
          merged.size = new TextEncoder().encode(updates.content).length;
        }
        return merged;
      }
      return f;
    });
    onChange(updated);
  };

  const handleDeleteFile = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    onChange(updated);
    if (activeFileId === id) {
      setActiveFileId(updated[0]?.id || null);
    }
  };

  const activeFile = files.find((f) => f.id === activeFileId) || null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-foreground" />
          <span className="text-xs font-semibold text-foreground">
            Berkas Pendukung Skill ({files.length}/{maxFiles})
          </span>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={files.length >= maxFiles}
              className="inline-flex items-center gap-1.5 h-6 px-2 rounded-[5px] border border-border bg-background hover:bg-muted text-[11px] font-medium text-foreground transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
            >
              <Upload className="w-3 h-3 text-muted-foreground" />
              <span>Unggah Berkas</span>
            </button>
            <button
              type="button"
              onClick={handleAddBlankFile}
              disabled={files.length >= maxFiles}
              className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-[5px] bg-foreground text-background text-[11px] font-medium hover:opacity-90 transition-all active:scale-95 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3 h-3" />
              <span>Tambah Berkas</span>
            </button>
          </div>
        )}
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="p-2.5 rounded-[6px] border border-rose-500/40 bg-rose-500/10 text-rose-500 text-xs flex items-center gap-2"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {files.length === 0 ? (
        <div className="p-6 rounded-lg border border-dashed border-border bg-surface text-center space-y-2">
          <FileSpreadsheet className="w-8 h-8 text-muted-foreground/60 mx-auto" />
          <p className="text-xs text-muted-foreground">
            Belum ada berkas pendukung. Anda dapat menambahkan hingga 10 berkas (script, konfigurasi, template data).
          </p>
          {!readOnly && (
            <div className="pt-1 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-[5px] border border-border bg-background hover:bg-muted text-xs font-medium text-foreground transition-all active:scale-95 cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Pilih Berkas dari Komputer</span>
              </button>
              <button
                type="button"
                onClick={handleAddBlankFile}
                className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-[5px] bg-foreground text-background text-xs font-medium hover:opacity-90 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Buat Berkas Baru</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface overflow-hidden">
          <div className="flex items-center border-b border-border bg-muted/30 overflow-x-auto scrollbar-none px-2 pt-2 gap-1.5">
            {files.map((file) => {
              const isActive = file.id === activeFileId;
              return (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => setActiveFileId(file.id)}
                  className={`inline-flex items-center gap-1.5 h-7 px-2.5 text-[11px] font-mono rounded-t-[5px] transition-colors cursor-pointer border-t border-x ${
                    isActive
                      ? "bg-surface text-foreground font-semibold border-border border-b-surface -mb-px"
                      : "bg-transparent text-muted-foreground hover:text-foreground border-transparent hover:bg-muted/50"
                  }`}
                >
                  <Code className="w-3 h-3 text-muted-foreground" />
                  <span className="truncate max-w-[140px]">{file.name}</span>
                </button>
              );
            })}
          </div>

          {activeFile && (
            <div className="p-3.5 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={activeFile.name}
                    disabled={readOnly}
                    onChange={(e) => handleUpdateFile(activeFile.id, { name: e.target.value })}
                    placeholder="nama-berkas.ext"
                    className="h-7 px-2.5 rounded-[5px] border border-border bg-background text-foreground text-xs font-mono focus:outline-2 focus:outline-foreground w-full max-w-xs"
                  />
                  <select
                    value={activeFile.language || "text"}
                    disabled={readOnly}
                    onChange={(e) => handleUpdateFile(activeFile.id, { language: e.target.value })}
                    className="h-7 px-2 rounded-[5px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground cursor-pointer"
                  >
                    <option value="bash">Bash / Shell</option>
                    <option value="python">Python</option>
                    <option value="typescript">TypeScript</option>
                    <option value="javascript">JavaScript</option>
                    <option value="json">JSON</option>
                    <option value="yaml">YAML</option>
                    <option value="markdown">Markdown</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="sql">SQL</option>
                    <option value="text">Plain Text</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {Math.round((activeFile.size || 0) / 1024 * 10) / 10} KB
                  </span>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(activeFile.id)}
                      className="inline-flex items-center gap-1 h-7 px-2 rounded-[5px] text-rose-500 hover:bg-rose-500/10 text-xs transition-colors cursor-pointer"
                      title="Hapus berkas"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>
              </div>

              <textarea
                rows={9}
                value={activeFile.content}
                disabled={readOnly}
                onChange={(e) => handleUpdateFile(activeFile.id, { content: e.target.value })}
                placeholder="Tulis atau tempel isi berkas di sini..."
                className="w-full p-3 rounded-[5px] border border-border bg-background text-foreground font-mono text-xs focus:outline-2 focus:outline-foreground leading-relaxed resize-y"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
