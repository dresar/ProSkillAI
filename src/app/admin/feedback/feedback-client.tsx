"use client";

import * as React from "react";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Clock,
  User,
  Mail,
  AlertTriangle,
  Lightbulb,
  Palette,
  HelpCircle,
} from "lucide-react";
import { updateFeedbackStatusAction, deleteFeedbackAction } from "./actions";
import type { Feedback } from "@/db/schema";

interface FeedbackClientProps {
  initialFeedbacks: Feedback[];
  userRole: string;
}

export function FeedbackClient({ initialFeedbacks, userRole }: FeedbackClientProps) {
  const [filter, setFilter] = React.useState<"all" | "unread" | "bug" | "skill_request" | "resolved">("all");
  const [search, setSearch] = React.useState("");
  const [items, setItems] = React.useState(initialFeedbacks);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const filtered = items.filter((item) => {
    if (filter === "unread" && item.status !== "unread") return false;
    if (filter === "bug" && item.category !== "bug") return false;
    if (filter === "skill_request" && item.category !== "skill_request") return false;
    if (filter === "resolved" && item.status !== "resolved") return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchMessage = item.message.toLowerCase().includes(q);
      const matchEmail = (item.userEmail || "").toLowerCase().includes(q);
      const matchName = (item.userName || "").toLowerCase().includes(q);
      const matchUrl = (item.url || "").toLowerCase().includes(q);
      return matchMessage || matchEmail || matchName || matchUrl;
    }
    return true;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    setBusyId(id);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    await updateFeedbackStatusAction(id, newStatus);
    setBusyId(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Hapus umpan balik ini secara permanen?")) return;
    setBusyId(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    await deleteFeedbackAction(id);
    setBusyId(null);
  };

  const stats = {
    total: items.length,
    unread: items.filter((i) => i.status === "unread").length,
    bugs: items.filter((i) => i.category === "bug").length,
    requests: items.filter((i) => i.category === "skill_request").length,
    resolved: items.filter((i) => i.status === "resolved").length,
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "bug":
        return {
          icon: AlertTriangle,
          label: "Laporan Bug",
          color: "border-rose-500/40 bg-rose-500/10 text-rose-500",
        };
      case "skill_request":
        return {
          icon: Lightbulb,
          label: "Permintaan Skill",
          color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
        };
      case "ux":
        return {
          icon: Palette,
          label: "Saran UI/UX",
          color: "border-cyan-500/40 bg-cyan-500/10 text-cyan-500",
        };
      case "other":
        return {
          icon: HelpCircle,
          label: "Lainnya",
          color: "border-border bg-muted text-muted-foreground",
        };
      default:
        return {
          icon: MessageSquare,
          label: "Umum",
          color: "border-indigo-500/40 bg-indigo-500/10 text-indigo-400",
        };
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "unread":
        return (
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-[4px] bg-amber-500/10 text-amber-500 border border-amber-500/30">
            Belum Dibaca
          </span>
        );
      case "read":
        return (
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-[4px] bg-muted text-muted-foreground border border-border">
            Dibaca
          </span>
        );
      case "resolved":
        return (
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-[4px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            Selesai
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-border bg-surface shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-muted-foreground block">Total Umpan Balik</span>
          <span className="text-xl font-bold text-foreground font-mono">{stats.total}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-border bg-surface shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-amber-500 block">Belum Dibaca</span>
          <span className="text-xl font-bold text-amber-500 font-mono">{stats.unread}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-border bg-surface shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-rose-500 block">Laporan Bug</span>
          <span className="text-xl font-bold text-rose-500 font-mono">{stats.bugs}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-border bg-surface shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-emerald-500 block">Permintaan Skill</span>
          <span className="text-xl font-bold text-emerald-500 font-mono">{stats.requests}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: "all", label: `Semua (${stats.total})` },
            { id: "unread", label: `Belum Dibaca (${stats.unread})` },
            { id: "bug", label: `Bug (${stats.bugs})` },
            { id: "skill_request", label: `Permintaan Skill (${stats.requests})` },
            { id: "resolved", label: `Selesai (${stats.resolved})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`h-8 px-3 rounded-[6px] border text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                filter === tab.id
                  ? "bg-foreground text-background border-foreground font-semibold shadow-2xs"
                  : "bg-surface hover:bg-muted text-muted-foreground hover:text-foreground border-border/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pesan, email, URL..."
            className="w-full h-8 pl-8 pr-3 rounded-[6px] border border-border bg-surface text-foreground text-xs focus:outline-2 focus:outline-foreground"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center rounded-xl border border-dashed border-border bg-surface/50 space-y-2">
          <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
          <p className="text-sm font-semibold text-foreground">Tidak Ada Umpan Balik</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Belum ada umpan balik yang cocok dengan filter atau pencarian saat ini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const catBadge = getCategoryBadge(item.category);
            const CatIcon = catBadge.icon;
            const dateStr = item.createdAt
              ? new Date(item.createdAt).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "-";

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-xl border transition-all shadow-2xs space-y-3 ${
                  item.status === "unread"
                    ? "border-amber-500/50 bg-amber-500/[0.02]"
                    : "border-border bg-surface"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border/70">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] border text-[11px] font-semibold ${catBadge.color}`}
                    >
                      <CatIcon className="w-3 h-3" />
                      <span>{catBadge.label}</span>
                    </span>

                    {getStatusBadge(item.status)}

                    <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{dateStr}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.status !== "resolved" && (
                      <button
                        type="button"
                        disabled={busyId === item.id}
                        onClick={() => handleStatusChange(item.id, "resolved")}
                        className="inline-flex items-center gap-1 h-7 px-2.5 rounded-[5px] border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Selesaikan</span>
                      </button>
                    )}

                    {item.status === "unread" && (
                      <button
                        type="button"
                        disabled={busyId === item.id}
                        onClick={() => handleStatusChange(item.id, "read")}
                        className="inline-flex items-center gap-1 h-7 px-2.5 rounded-[5px] border border-border bg-surface hover:bg-muted text-foreground text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <span>Tandai Dibaca</span>
                      </button>
                    )}

                    {userRole === "admin" && (
                      <button
                        type="button"
                        disabled={busyId === item.id}
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-[5px] border border-border hover:border-rose-500/40 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer disabled:opacity-50"
                        title="Hapus umpan balik"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                  {item.message}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="font-medium text-foreground">
                        {item.userName || "Anonim"}
                      </span>
                    </span>
                    {item.userEmail && (
                      <span className="flex items-center gap-1 font-mono">
                        <Mail className="w-3 h-3" />
                        <span>{item.userEmail}</span>
                      </span>
                    )}
                  </div>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-foreground font-mono transition-colors"
                    >
                      <span className="truncate max-w-[240px]">{item.url}</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
