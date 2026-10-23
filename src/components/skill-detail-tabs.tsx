"use client";

import * as React from "react";
import { Eye, FileText, Braces, FileCode } from "lucide-react";

interface SkillDetailTabsProps {
  hasPreview: boolean;
  previewNode: React.ReactNode;
  contentNode: React.ReactNode;
  rawNode: React.ReactNode;
  filesNode?: React.ReactNode;
  filesCount?: number;
  locale: string;
}

type TabId = "preview" | "content" | "raw" | "files";

export function SkillDetailTabs({
  hasPreview,
  previewNode,
  contentNode,
  rawNode,
  filesNode,
  filesCount = 0,
  locale,
}: SkillDetailTabsProps) {
  const isEn = locale === "en";

  const tabs: Array<{ id: TabId; label: string; icon: React.ReactNode; node: React.ReactNode }> = [];

  if (hasPreview) {
    tabs.push({
      id: "preview",
      label: isEn ? "Preview" : "Pratinjau",
      icon: <Eye className="w-3.5 h-3.5" />,
      node: previewNode,
    });
  }

  tabs.push({
    id: "content",
    label: isEn ? "SKILL.md Content" : "Isi SKILL.md",
    icon: <FileText className="w-3.5 h-3.5" />,
    node: contentNode,
  });

  if (filesNode && filesCount > 0) {
    tabs.push({
      id: "files",
      label: isEn ? `Files (${filesCount})` : `Berkas (${filesCount})`,
      icon: <FileCode className="w-3.5 h-3.5" />,
      node: filesNode,
    });
  }

  tabs.push({
    id: "raw",
    label: isEn ? "Raw Markdown" : "Markdown Mentah",
    icon: <Braces className="w-3.5 h-3.5" />,
    node: rawNode,
  });

  const [selectedId, setSelectedId] = React.useState<TabId>(hasPreview ? "preview" : "content");

  const activeId: TabId = tabs.some((t) => t.id === selectedId) ? selectedId : tabs[0].id;
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.id === activeId)
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (activeIndex + dir + tabs.length) % tabs.length;
    setSelectedId(tabs[next].id);
  };

  return (
    <div className="space-y-5">
      <div
        role="tablist"
        aria-label={isEn ? "Skill view options" : "Pilihan tampilan skill"}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-1.5 p-1 rounded-lg border border-border bg-muted w-fit"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeId === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeId === tab.id ? 0 : -1}
            onClick={() => setSelectedId(tab.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              activeId === tab.id
                ? "bg-foreground text-background shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeId !== tab.id}
        >
          {activeId === tab.id && tab.node}
        </div>
      ))}
    </div>
  );
}
