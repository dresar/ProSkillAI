"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  X,
  Check,
  Copy,
  Download,
  Loader2,
  UserCheck,
  UserX,
} from "lucide-react";
import type {
  ShareItemData,
  ShareUserAttribution,
} from "@/types/share";
import {
  buildShareUrl,
  getCurrentDomain,
} from "@/lib/share-utils";
import { ShareCard } from "./share-card";
import { downloadShareCardImage } from "./share-canvas";

interface ShareModalProps {
  item: ShareItemData;
  locale?: string;
  onClose: () => void;
}

export function ShareModal({
  item,
  locale = "id",
  onClose,
}: ShareModalProps) {
  const isEn = locale === "en";
  const [mounted, setMounted] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<string | null>(null);
  const [showUser, setShowUser] = React.useState(true);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const [currentDomain, setCurrentDomain] = React.useState("skills.biz.id");

  const canonicalUrl = buildShareUrl(item.url);

  React.useEffect(() => {
    setMounted(true);
    setCurrentDomain(getCurrentDomain());

    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data?.username) {
          setCurrentUser(data.username);
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleCopyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(canonicalUrl);
      } else {
        const input = document.createElement("input");
        input.value = canonicalUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(false);
    }
  };

  const userAttribution: ShareUserAttribution | undefined = currentUser
    ? { username: currentUser, show: showUser }
    : undefined;

  const handleDownloadImage = async () => {
    setIsExporting(true);
    try {
      await downloadShareCardImage(
        item,
        "dark",
        "zinc",
        "16:9",
        userAttribution,
        currentDomain
      );
    } finally {
      setIsExporting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs select-none"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg rounded-xl border border-border bg-surface shadow-2xl flex flex-col overflow-hidden z-10">
        <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between gap-3 shrink-0">
          <h2
            id="share-modal-title"
            className="text-sm font-semibold text-foreground tracking-tight"
          >
            {isEn ? "Share" : "Bagikan"}
          </h2>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <button
                type="button"
                onClick={() => setShowUser(!showUser)}
                className={`h-7 px-2.5 rounded-[5px] border text-[11px] font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 active:scale-[0.98] ${
                  showUser
                    ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {showUser ? (
                  <>
                    <UserCheck className="w-3 h-3 text-cyan-400" />
                    <span className="font-mono text-[10px]">@{currentUser}</span>
                  </>
                ) : (
                  <>
                    <UserX className="w-3 h-3" />
                    <span>{isEn ? "Hide" : "Sembunyi"}</span>
                  </>
                )}
              </button>
            ) : null}

            <button
              type="button"
              onClick={onClose}
              aria-label={isEn ? "Close dialog" : "Tutup"}
              className="w-7 h-7 rounded-[6px] border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer active:scale-[0.98]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3.5 flex-1 min-h-0 bg-surface">
          <div className="w-full rounded-lg overflow-hidden border border-border/80 shadow-md">
            <ShareCard
              item={item}
              userAttribution={userAttribution}
              domain={currentDomain}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={canonicalUrl}
              className="flex-1 h-9 px-3 rounded-[6px] border border-border bg-background text-xs font-mono text-muted-foreground select-all focus:outline-none focus:ring-1 focus:ring-foreground"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="h-9 px-3.5 rounded-[6px] border border-border bg-background hover:bg-muted text-xs font-medium text-foreground inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 active:scale-[0.98]"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">{isEn ? "Copied" : "Disalin"}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isEn ? "Copy" : "Salin"}</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="w-full h-10 rounded-[6px] border border-foreground bg-foreground text-background text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 active:scale-[0.98]"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isEn ? "Downloading..." : "Mengunduh..."}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{isEn ? "Download" : "Unduh"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
