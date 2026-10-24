"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  X,
  Check,
  Copy,
  Download,
  Share2,
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
  buildSocialShareUrls,
  getCurrentDomain,
} from "@/lib/share-utils";
import { BrandLogo } from "@/components/brand-logo";
import { ShareCard } from "./share-card";
import { downloadShareCardImage } from "./share-canvas";

interface ShareModalProps {
  item: ShareItemData;
  locale?: string;
  onClose: () => void;
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.41a8.19 8.19 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.87-.38-4.12-1.1l-.3-.17-3.12.82.83-3.04-.19-.31a8.21 8.21 0 01-1.25-4.44c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.49-1.41-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24m1.4 9.74v-8.37H5.06v8.37h2.8z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
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
  const [canWebShare, setCanWebShare] = React.useState(false);
  const [currentDomain, setCurrentDomain] = React.useState("proskillai.dev");

  const canonicalUrl = buildShareUrl(item.url);
  const socialUrls = buildSocialShareUrls(item, canonicalUrl);

  React.useEffect(() => {
    setMounted(true);
    setCurrentDomain(getCurrentDomain());
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanWebShare(true);
    }

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
      await downloadShareCardImage(item, "dark", "zinc", "16:9", userAttribution, currentDomain);
    } finally {
      setIsExporting(false);
    }
  };

  const handleWebShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: item.title,
        text: item.description,
        url: canonicalUrl,
      });
    } catch {
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg rounded-xl border border-border bg-surface shadow-2xl flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-border/80 bg-muted/30 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <BrandLogo size={24} className="w-6 h-6 shrink-0" />
            <div className="flex items-baseline gap-2">
              <h2 id="share-modal-title" className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                {isEn ? "Share Card" : "Bagikan Kartu"}
              </h2>
              <span className="text-[10px] text-cyan-400 font-mono hidden sm:inline">
                {currentDomain}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 border border-border bg-background p-0.5 rounded-[6px]">
              <a
                href={socialUrls.twitter}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on X / Twitter"
                aria-label="Share on X / Twitter"
                className="w-6 h-6 rounded-[4px] hover:bg-muted text-foreground flex items-center justify-center transition-colors active:scale-[0.98]"
              >
                <TwitterIcon className="w-3 h-3" />
              </a>
              <a
                href={socialUrls.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on WhatsApp"
                aria-label="Share on WhatsApp"
                className="w-6 h-6 rounded-[4px] hover:bg-muted text-emerald-500 flex items-center justify-center transition-colors active:scale-[0.98]"
              >
                <WhatsAppIcon className="w-3 h-3" />
              </a>
              <a
                href={socialUrls.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on LinkedIn"
                aria-label="Share on LinkedIn"
                className="w-6 h-6 rounded-[4px] hover:bg-muted text-sky-500 flex items-center justify-center transition-colors active:scale-[0.98]"
              >
                <LinkedInIcon className="w-3 h-3" />
              </a>
              <a
                href={socialUrls.telegram}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on Telegram"
                aria-label="Share on Telegram"
                className="w-6 h-6 rounded-[4px] hover:bg-muted text-cyan-500 flex items-center justify-center transition-colors active:scale-[0.98]"
              >
                <TelegramIcon className="w-3 h-3" />
              </a>
            </div>

            {currentUser && (
              <button
                type="button"
                onClick={() => setShowUser(!showUser)}
                className={`h-7 px-2 rounded-[5px] border text-[11px] font-medium inline-flex items-center gap-1 transition-colors cursor-pointer shrink-0 active:scale-[0.98] ${
                  showUser
                    ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
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
                    <span>{isEn ? "Hide" : "Anon"}</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label={isEn ? "Close dialog" : "Tutup dialog"}
              className="w-7 h-7 rounded-[6px] border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer active:scale-[0.98]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-4 space-y-3 flex-1 min-h-0">
          <div className="w-full flex items-center justify-center p-2 rounded-xs bg-muted/20 border border-border/70 overflow-hidden">
            <div className="w-full max-w-[460px] aspect-16/9 flex items-center justify-center">
              <ShareCard
                item={item}
                userAttribution={userAttribution}
                domain={currentDomain}
                className="h-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              type="button"
              onClick={handleCopyLink}
              className="h-8 px-3 rounded-[6px] border border-border bg-background hover:bg-muted text-xs font-medium text-foreground inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-[0.98]"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">{isEn ? "Copied!" : "Disalin!"}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isEn ? "Copy Link" : "Salin Link"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="h-8 px-3 rounded-[6px] border border-foreground bg-foreground text-background text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 active:scale-[0.98]"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{isEn ? "Download 16:9 PNG" : "Unduh 16:9 PNG"}</span>
                </>
              )}
            </button>
          </div>

          {canWebShare && (
            <button
              type="button"
              onClick={handleWebShare}
              className="w-full h-7 px-2 rounded-[6px] border border-dashed border-border bg-muted/30 hover:bg-muted text-[11px] font-medium text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-[0.98]"
            >
              <Share2 className="w-3 h-3" />
              <span>{isEn ? "Share via Device" : "Bagikan via Menu Perangkat"}</span>
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}