"use client";

import * as React from "react";
import Image from "next/image";
import { Monitor, Smartphone, ImageOff, Film } from "lucide-react";
import type { Skill } from "@/db/schema";
import { ClientMarkdownRenderer } from "./client-markdown-renderer";

interface SkillPreviewViewerProps {
  skill: Skill;
  locale: string;
}

type ResolvedVideo =
  | { kind: "iframe"; src: string }
  | { kind: "video"; src: string }
  | null;

function resolveVideo(url: string): ResolvedVideo {
  const u = url.trim();
  if (!u) return null;

  const ytWatch = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  if (ytWatch) return { kind: "iframe", src: `https://www.youtube.com/embed/${ytWatch[1]}` };

  const ytEmbed = u.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/);
  if (ytEmbed) return { kind: "iframe", src: `https://www.youtube.com/embed/${ytEmbed[1]}` };

  const loomShare = u.match(/loom\.com\/share\/([A-Za-z0-9]+)/);
  if (loomShare) return { kind: "iframe", src: `https://www.loom.com/embed/${loomShare[1]}` };

  const loomEmbed = u.match(/loom\.com\/embed\/([A-Za-z0-9]+)/);
  if (loomEmbed) return { kind: "iframe", src: `https://www.loom.com/embed/${loomEmbed[1]}` };

  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(u) || u.startsWith("blob:")) {
    return { kind: "video", src: u };
  }

  if (/^https?:\/\//i.test(u)) {
    return { kind: "video", src: u };
  }

  return null;
}

function VideoEmbed({ src }: { src: string }) {
  const resolved = resolveVideo(src);

  if (!resolved) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 aspect-video w-full rounded-lg border border-dashed border-border bg-muted/30 text-muted-foreground">
        <Film className="w-5 h-5" />
        <span className="text-xs">Video preview unavailable</span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-lg border border-border bg-black overflow-hidden">
      {resolved.kind === "iframe" ? (
        <iframe
          src={resolved.src}
          title="Skill Video Preview"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 w-full h-full border-0"
        />
      ) : (
        <video
          src={resolved.src}
          controls
          preload="metadata"
          playsInline
          className="absolute inset-0 w-full h-full object-contain"
        />
      )}
    </div>
  );
}

function ImagePreview({ src, alt }: { src: string; alt: string }) {
  const [status, setStatus] = React.useState<"loading" | "loaded" | "error">("loading");

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center gap-2 aspect-video w-full rounded-lg border border-dashed border-border bg-muted/30 text-muted-foreground">
        <ImageOff className="w-5 h-5" />
        <span className="text-xs">Image failed to load</span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-lg border border-border bg-muted overflow-hidden">
      {status === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-muted" aria-hidden="true" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, 768px"
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        className={`object-contain transition-opacity duration-300 ${
          status === "loaded" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export function SkillPreviewViewer({ skill, locale }: SkillPreviewViewerProps) {
  const [viewport, setViewport] = React.useState<"desktop" | "mobile">("desktop");
  const [previewTheme, setPreviewTheme] = React.useState<"light" | "dark">("light");

  const isVideo = skill.previewType === "video" || Boolean(skill.previewVideoUrl);
  const hasAnyPreview = Boolean(
    skill.previewHtml ||
      skill.previewImageUrl ||
      skill.previewVideoUrl ||
      skill.designTokens ||
      skill.previewType === "markdown"
  );

  if (skill.previewType === "none" || !hasAnyPreview) {
    return (
      <div className="p-8 text-center border border-dashed border-border rounded-xl text-muted-foreground text-xs">
        {locale === "en"
          ? "This skill contains textual guidelines and does not require a visual interface preview."
          : "Skill ini memuat panduan teks murni dan tidak memerlukan pratinjau antarmuka visual."}
      </div>
    );
  }

  const showViewportToggle = skill.previewType === "html";
  const content = locale === "en" ? skill.contentEn : skill.contentId;
  const alt = locale === "en" ? skill.titleEn : skill.titleId;

  return (
    <div className="space-y-3">
      {showViewportToggle && (
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 border border-border rounded-lg p-0.5 bg-muted">
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                viewport === "desktop"
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface"
              }`}
              aria-label="Desktop preview"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                viewport === "mobile"
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface"
              }`}
              aria-label="Mobile preview"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile (390px)</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 border border-border rounded-lg p-0.5 bg-muted">
            <button
              type="button"
              onClick={() => setPreviewTheme("light")}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                previewTheme === "light"
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface"
              }`}
            >
              {locale === "en" ? "Light" : "Terang"}
            </button>
            <button
              type="button"
              onClick={() => setPreviewTheme("dark")}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                previewTheme === "dark"
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface"
              }`}
            >
              {locale === "en" ? "Dark" : "Gelap"}
            </button>
          </div>
        </div>
      )}

      <div
        className={`w-full flex justify-center bg-muted/30 p-4 rounded-xl border border-border min-h-[200px] ${
          isVideo ? "" : "overflow-x-auto"
        }`}
      >
        <div
          className={`transition-all duration-300 w-full ${
            showViewportToggle && viewport === "mobile" ? "max-w-[390px]" : "max-w-full"
          }`}
        >
          {isVideo && skill.previewVideoUrl && <VideoEmbed src={skill.previewVideoUrl} />}

          {!isVideo && skill.previewType === "image" && skill.previewImageUrl && (
            <ImagePreview src={skill.previewImageUrl} alt={alt} />
          )}

          {!isVideo && skill.previewType === "html" && skill.previewHtml && (
            <div className="w-full h-[480px] rounded-lg border border-border bg-white overflow-hidden shadow-xs">
              <iframe
                title="Skill Preview"
                sandbox=""
                srcDoc={
                  previewTheme === "dark"
                    ? `<style>html{filter:invert(0.92) hue-rotate(180deg);}</style>${skill.previewHtml}`
                    : skill.previewHtml
                }
                className="w-full h-full border-0"
              />
            </div>
          )}

          {!isVideo && skill.previewType === "markdown" && (
            <div className="w-full rounded-lg border border-border bg-surface p-4 sm:p-6">
              <ClientMarkdownRenderer content={content} />
            </div>
          )}

          {!isVideo && skill.previewType === "tokens" && Boolean(skill.designTokens) && (
            <div className="w-full p-6 rounded-lg border border-border bg-surface text-foreground space-y-6">
              {Array.isArray((skill.designTokens as { colors?: Array<{ name: string; hex: string }> })?.colors) && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    {locale === "en" ? "Color Tokens" : "Token Warna"}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(skill.designTokens as { colors: Array<{ name: string; hex: string }> }).colors.map((c, i) => (
                      <div key={i} className="p-2.5 rounded-lg border border-border bg-muted/40 text-xs">
                        <div
                          className="w-full h-8 rounded-md border border-border mb-2"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div className="font-medium text-foreground">{c.name}</div>
                        <div className="font-mono text-muted-foreground text-[11px]">{c.hex}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray((skill.designTokens as { typography?: Array<{ label: string; value: string }> })?.typography) && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    {locale === "en" ? "Typography" : "Tipografi"}
                  </h4>
                  <div className="space-y-2 text-xs">
                    {(skill.designTokens as { typography: Array<{ label: string; value: string }> }).typography.map((t, i) => (
                      <div key={i} className="p-2.5 rounded-lg border border-border bg-muted/40 flex justify-between items-center">
                        <span className="text-muted-foreground">{t.label}</span>
                        <span className="font-mono text-foreground">{t.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray((skill.designTokens as { radius?: string[] })?.radius) && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    {locale === "en" ? "Radius Scale" : "Skala Radius"}
                  </h4>
                  <div className="flex gap-2 flex-wrap text-xs">
                    {(skill.designTokens as { radius: string[] }).radius.map((r, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-md border border-border bg-muted/40 font-mono">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
