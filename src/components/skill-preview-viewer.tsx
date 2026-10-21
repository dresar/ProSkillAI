"use client";

import * as React from "react";
import Image from "next/image";
import { Monitor, Smartphone } from "lucide-react";
import type { Skill } from "@/db/schema";

interface SkillPreviewViewerProps {
  skill: Skill;
  locale: string;
}

export function SkillPreviewViewer({ skill, locale }: SkillPreviewViewerProps) {
  const [viewport, setViewport] = React.useState<"desktop" | "mobile">("desktop");
  const [previewTheme, setPreviewTheme] = React.useState<"light" | "dark">("light");

  if (skill.previewType === "none" || (!skill.previewHtml && !skill.previewImageUrl && !skill.designTokens)) {
    return (
      <div className="p-8 text-center border border-dashed border-border rounded-xl text-muted-foreground text-xs">
        {locale === "en"
          ? "This skill contains textual guidelines and does not require a visual interface preview."
          : "Skill ini memuat panduan teks murni dan tidak memerlukan pratinjau antarmuka visual."}
      </div>
    );
  }

  return (
    <div className="space-y-3">
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

        {skill.previewType === "html" && (
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
        )}
      </div>

      <div className="w-full flex justify-center bg-muted/30 p-4 rounded-xl border border-border overflow-x-auto min-h-[360px]">
        <div
          className={`transition-all duration-300 w-full ${
            viewport === "mobile" ? "max-w-[390px]" : "max-w-full"
          }`}
        >
          {skill.previewType === "html" && skill.previewHtml && (
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

          {skill.previewType === "image" && skill.previewImageUrl && (
            <div className="w-full rounded-lg border border-border overflow-hidden bg-surface">
              <Image
                src={skill.previewImageUrl}
                alt={locale === "en" ? skill.titleEn : skill.titleId}
                width={1200}
                height={800}
                unoptimized
                className="w-full h-auto object-contain"
              />
            </div>
          )}

          {skill.previewType === "tokens" && Boolean(skill.designTokens) && (
            <div className="w-full p-6 rounded-lg border border-border bg-surface text-foreground space-y-6">
              {Array.isArray((skill.designTokens as { colors?: Array<{ name: string; hex: string; darkHex?: string }> })?.colors) && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    {locale === "en" ? "Color Tokens" : "Token Warna"}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(skill.designTokens as { colors: Array<{ name: string; hex: string; darkHex?: string }> }).colors.map(
                      (c, i) => (
                        <div key={i} className="p-2.5 rounded-lg border border-border bg-muted/40 text-xs">
                          <div
                            className="w-full h-8 rounded-md border border-border mb-2"
                            style={{ backgroundColor: c.hex }}
                          />
                          <div className="font-medium text-foreground">{c.name}</div>
                          <div className="font-mono text-muted-foreground text-[11px]">{c.hex}</div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {Array.isArray((skill.designTokens as { typography?: Array<{ label: string; value: string }> })?.typography) && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    {locale === "en" ? "Typography" : "Tipografi"}
                  </h4>
                  <div className="space-y-2 text-xs">
                    {(skill.designTokens as { typography: Array<{ label: string; value: string }> }).typography.map(
                      (t, i) => (
                        <div key={i} className="p-2.5 rounded-lg border border-border bg-muted/40 flex justify-between items-center">
                          <span className="text-muted-foreground">{t.label}</span>
                          <span className="font-mono text-foreground">{t.value}</span>
                        </div>
                      )
                    )}
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
