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
  FileText,
} from "lucide-react";
import type {
  ShareItemData,
  ShareUserAttribution,
} from "@/types/share";
import {
  buildShareCaption,
  buildShareUrl,
  buildSocialShareUrls,
  extractOwnerAndRepo,
  getCurrentDomain,
} from "@/lib/share-utils";
import { ShareCard } from "./share-card";
import { downloadShareCardImage, fetchShareCardBlob } from "./share-canvas";

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

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.186 24C5.514 24 0 18.64 0 12.015 0 5.39 5.514 0 12.186 0c6.672 0 12.186 5.39 12.186 12.015 0 2.215-.615 4.348-1.78 6.17l-1.954-1.25a9.778 9.778 0 0 0 1.417-4.92c0-5.346-4.426-9.697-9.869-9.697-5.443 0-9.87 4.351-9.87 9.697 0 5.347 4.427 9.698 9.87 9.698 3.013 0 5.706-1.341 7.489-3.48l1.769 1.493C19.124 21.911 15.82 24 12.186 24zm4.128-10.027c-.207 3.52-2.122 5.097-4.471 5.097-1.895 0-3.327-1.25-3.327-3.64 0-3.087 2.203-4.526 4.966-4.526.475 0 .918.04 1.328.115v-.604c0-1.42-.81-2.227-2.308-2.227-1.233 0-2.212.518-2.616 1.385l-1.927-.978c.808-1.748 2.65-2.695 4.704-2.695 2.87 0 4.464 1.636 4.464 4.249v3.823h-.813zm-1.504-1.272c-.365-.078-.79-.12-1.253-.12-1.634 0-2.83.743-2.83 2.502 0 1.25.753 1.933 1.77 1.933 1.348 0 2.313-1.042 2.313-3.048v-1.267z" />
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
  const [copiedCaption, setCopiedCaption] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const [canWebShare, setCanWebShare] = React.useState(false);
  const [currentDomain, setCurrentDomain] = React.useState("skills.biz.id");

  const { owner, repo } = extractOwnerAndRepo(item);
  const canonicalUrl = buildShareUrl(item.url);
  const captionText = buildShareCaption(owner, repo, item.description || "", canonicalUrl);
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

  const handleCopyCaption = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(captionText);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = captionText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    } catch {
      setCopiedCaption(false);
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

  const handleWebShare = async () => {
    if (!navigator.share) return;
    try {
      const cleanOwner = owner.toLowerCase().replace(/[^a-z0-9_-]/g, "");
      const cleanRepo = repo.toLowerCase().replace(/[^a-z0-9_-]/g, "");
      const filename = `proskillai-${cleanOwner}-${cleanRepo}.png`;

      let sharedWithFile = false;
      if (typeof navigator.canShare === "function") {
        try {
          const blob = await fetchShareCardBlob(item, {
            userAttribution,
            domain: currentDomain,
            width: 2400,
            height: 1350,
          });
          const file = new File([blob], filename, { type: "image/png" });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `${owner}/${repo}`,
              text: captionText,
              url: canonicalUrl,
              files: [file],
            });
            sharedWithFile = true;
          }
        } catch {
          sharedWithFile = false;
        }
      }

      if (!sharedWithFile) {
        await navigator.share({
          title: `${owner}/${repo}`,
          text: captionText,
          url: canonicalUrl,
        });
      }
    } catch {
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 select-none"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl bg-white border-4 border-black shadow-[10px_10px_0_#000] flex flex-col overflow-hidden z-10 font-['Space_Mono',monospace]">
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-[#FFD23F] border-b-4 border-black flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-black shrink-0" />
            <h2
              id="share-modal-title"
              className="text-xs sm:text-sm font-['Archivo_Black',sans-serif] text-black tracking-tight uppercase"
            >
              {isEn ? "Share Card" : "Bagikan Kartu"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                type="button"
                onClick={() => setShowUser(!showUser)}
                className={`min-h-[32px] h-8 px-2.5 border-2 border-black font-['Space_Mono',monospace] text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform ${
                  showUser ? "bg-[#FF5CA8] text-black" : "bg-white text-black"
                }`}
              >
                {showUser ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>@{currentUser}</span>
                  </>
                ) : (
                  <>
                    <UserX className="w-3.5 h-3.5" />
                    <span>{isEn ? "Anon" : "Anonim"}</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label={isEn ? "Close dialog" : "Tutup dialog"}
              className="w-8 h-8 border-2 border-black bg-white text-black hover:bg-neutral-100 flex items-center justify-center cursor-pointer shadow-[2px_2px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-4 flex-1 min-h-0 bg-white">
          <div className="w-full border-4 border-black shadow-[6px_6px_0_#000] overflow-hidden bg-[#FFD23F]">
            <ShareCard
              item={item}
              userAttribution={userAttribution}
              domain={currentDomain}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="min-h-[44px] h-11 px-3 bg-[#FFD23F] text-black font-['Space_Mono',monospace] font-bold text-xs sm:text-[13px] border-4 border-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-transform inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEn ? "Generating..." : "Membuat PNG..."}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>{isEn ? "Download PNG" : "Unduh PNG"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="min-h-[44px] h-11 px-3 bg-white text-black font-['Space_Mono',monospace] font-bold text-xs sm:text-[13px] border-4 border-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-transform inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isEn ? "Link Copied!" : "Link Disalin!"}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 stroke-[2.5]" />
                  <span>{isEn ? "Copy Link" : "Salin Link"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyCaption}
              className="min-h-[44px] h-11 px-3 bg-[#5CE1E6] text-black font-['Space_Mono',monospace] font-bold text-xs sm:text-[13px] border-4 border-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-transform inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {copiedCaption ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isEn ? "Caption Copied!" : "Caption Disalin!"}</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 stroke-[2.5]" />
                  <span>{isEn ? "Copy Caption" : "Salin Caption"}</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={socialUrls.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] h-11 px-3 bg-black text-white font-['Space_Mono',monospace] font-bold text-xs sm:text-[13px] border-4 border-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-transform inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <TwitterIcon className="w-4 h-4 fill-white" />
              <span>Share ke X</span>
            </a>

            <a
              href={socialUrls.threads}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] h-11 px-3 bg-black text-white font-['Space_Mono',monospace] font-bold text-xs sm:text-[13px] border-4 border-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-transform inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <ThreadsIcon className="w-4 h-4 fill-white" />
              <span>Threads</span>
            </a>
          </div>

          {canWebShare && (
            <button
              type="button"
              onClick={handleWebShare}
              className="w-full min-h-[44px] h-11 px-3 bg-[#B6FF5C] text-black font-['Space_Mono',monospace] font-bold text-xs sm:text-[13px] border-4 border-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-transform inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 stroke-[2.5]" />
              <span>{isEn ? "Share via Device Menu" : "Bagikan via Menu HP / Laptop"}</span>
            </button>
          )}

          <div className="border-4 border-black bg-[#FFFFFF] p-2.5 sm:p-3 shadow-[4px_4px_0_#000] flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-[#FF5CA8] border-2 border-black shrink-0" />
            <p className="text-[11px] sm:text-xs font-['Space_Mono',monospace] font-bold text-black leading-tight">
              {isEn
                ? "Download image, then upload to Instagram"
                : "Download gambar, lalu upload ke Instagram"}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
