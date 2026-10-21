"use client";

import * as React from "react";
import { Eye, FileText } from "lucide-react";

interface SkillDetailTabsProps {
  hasPreview: boolean;
  previewNode: React.ReactNode;
  contentNode: React.ReactNode;
  locale: string;
}

export function SkillDetailTabs({
  hasPreview,
  previewNode,
  contentNode,
  locale,
}: SkillDetailTabsProps) {
  const [activeTab, setActiveTab] = React.useState<"preview" | "content">(
    hasPreview ? "preview" : "content"
  );

  const isEn = locale === "en";

  if (!hasPreview) {
    return <div>{contentNode}</div>;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      setActiveTab((prev) => (prev === "preview" ? "content" : "preview"));
    }
  };

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label={isEn ? "Skill view options" : "Pilihan tampilan skill"}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-1.5 p-1 rounded-md border border-border bg-muted w-fit"
      >
        <button
          type="button"
          role="tab"
          id="tab-preview"
          aria-selected={activeTab === "preview"}
          aria-controls="panel-preview"
          tabIndex={activeTab === "preview" ? 0 : -1}
          onClick={() => setActiveTab("preview")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
            activeTab === "preview"
              ? "bg-foreground text-background shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-surface"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{isEn ? "Visual Preview" : "Pratinjau Visual"}</span>
        </button>

        <button
          type="button"
          role="tab"
          id="tab-content"
          aria-selected={activeTab === "content"}
          aria-controls="panel-content"
          tabIndex={activeTab === "content" ? 0 : -1}
          onClick={() => setActiveTab("content")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
            activeTab === "content"
              ? "bg-foreground text-background shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-surface"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{isEn ? "SKILL.md Content" : "Isi SKILL.md"}</span>
        </button>
      </div>

      <div
        role="tabpanel"
        id="panel-preview"
        aria-labelledby="tab-preview"
        hidden={activeTab !== "preview"}
      >
        {activeTab === "preview" && previewNode}
      </div>

      <div
        role="tabpanel"
        id="panel-content"
        aria-labelledby="tab-content"
        hidden={activeTab !== "content"}
      >
        {activeTab === "content" && contentNode}
      </div>
    </div>
  );
}
