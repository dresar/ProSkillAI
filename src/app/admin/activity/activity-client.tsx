"use client";

import * as React from "react";
import { Search, Trash2, Filter, ShieldAlert, Clock, User, ChevronDown, ChevronRight, X } from "lucide-react";
import { deleteActivityLogAction, clearOldActivityLogsAction } from "./actions";
import type { AuditLogEntry } from "@/db/schema";

interface ActivityClientProps {
  initialLogs: AuditLogEntry[];
  userRole: string;
}

export function ActivityClient({ initialLogs, userRole }: ActivityClientProps) {
  const [logs, setLogs] = React.useState<AuditLogEntry[]>(initialLogs);
  const [search, setSearch] = React.useState("");
  const [entityFilter, setEntityFilter] = React.useState("all");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [confirmClear, setConfirmClear] = React.useState(false);

  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      if (entityFilter !== "all" && log.entityType !== entityFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchAction = log.action.toLowerCase().includes(q);
        const matchEmail = (log.userEmail || "").toLowerCase().includes(q);
        const matchEntity = log.entityType.toLowerCase().includes(q);
        const matchId = (log.entityId || "").toLowerCase().includes(q);
        return matchAction || matchEmail || matchEntity || matchId;
      }
      return true;
    });
  }, [logs, entityFilter, search]);

  const handleDelete = async (id: string) => {
    setBusyId(id);
    setLogs((prev) => prev.filter((l) => l.id !== id));
    await deleteActivityLogAction(id);
    setBusyId(null);
  };

  const handleClearOld = async (days: number) => {
    setBusyId("clearing");
    await clearOldActivityLogsAction(days);
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    setLogs((prev) => prev.filter((l) => new Date(l.createdAt).getTime() >= cutoff));
    setConfirmClear(false);
    setBusyId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Log Aktivitas & Audit Keamanan
          </h2>
          <p className="text-xs text-muted-foreground">
            Catatan riwayat setiap tindakan administratif (siapa, apa, kapan, dan entitas terkait).
          </p>
        </div>

        {userRole === "admin" && (
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-border bg-surface text-xs font-medium text-muted-foreground hover:text-rose-500 hover:border-rose-500/30 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bersihkan Log Lama</span>
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari aksi, email, atau entity ID..."
            className="w-full h-8 pl-8 pr-3 rounded-[6px] border border-border bg-surface text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>

        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="h-8 px-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none"
        >
          <option value="all">Semua Tipe Entitas</option>
          <option value="skill">Skill</option>
          <option value="prompt">Prompt</option>
          <option value="category">Kategori</option>
          <option value="user">User</option>
          <option value="ui_inspiration">Design Trends (UI)</option>
          <option value="settings">Pengaturan</option>
        </select>
      </div>

      <div className="rounded-[8px] border border-border bg-surface overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/50 text-muted-foreground">
            <tr>
              <th className="p-3 font-semibold text-foreground">Aksi</th>
              <th className="p-3 font-semibold text-foreground">Pengguna</th>
              <th className="p-3 font-semibold text-foreground">Tipe Entitas</th>
              <th className="p-3 font-semibold text-foreground">Waktu</th>
              <th className="p-3 font-semibold text-foreground text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  Tidak ada catatan log aktivitas yang cocok.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const isExpanded = expandedId === log.id;
                return (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : log.id)}
                          className="inline-flex items-center gap-1.5 font-mono font-semibold text-foreground hover:text-cyan-500 transition-colors text-left"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                          <span>{log.action}</span>
                        </button>
                      </td>
                      <td className="p-3 text-muted-foreground font-mono text-[11px]">
                        {log.userEmail || "System"}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-[4px] border border-border bg-muted text-foreground text-[10px] font-mono">
                          {log.entityType} {log.entityId ? `(#${log.entityId.slice(0, 8)})` : ""}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-muted-foreground text-[11px]">
                        {new Date(log.createdAt).toLocaleString("id-ID")}
                      </td>
                      <td className="p-3 text-right">
                        {userRole === "admin" && (
                          <button
                            type="button"
                            disabled={busyId === log.id}
                            onClick={() => handleDelete(log.id)}
                            className="p-1 rounded text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Hapus baris log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                    {isExpanded && Boolean(log.details) ? (
                      <tr className="bg-muted/20">
                        <td colSpan={5} className="px-6 py-3 border-t border-border/60">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-mono text-muted-foreground font-semibold">
                              Detail Payload JSON:
                            </span>
                            <pre className="p-2.5 rounded-[6px] bg-background border border-border/80 font-mono text-[11px] text-foreground overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {confirmClear && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[8px] border border-border bg-surface p-5 space-y-4 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-rose-500">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-foreground">Bersihkan Log Aktivitas</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pilih rentang waktu untuk membersihkan riwayat log audit lama guna menghemat kapasitas database.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleClearOld(30)}
                className="h-8 px-2 rounded-[6px] border border-border bg-surface text-xs font-medium text-foreground hover:bg-muted"
              >
                Hapus &gt; 30 Hari
              </button>
              <button
                type="button"
                onClick={() => handleClearOld(7)}
                className="h-8 px-2 rounded-[6px] bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
              >
                Hapus &gt; 7 Hari
              </button>
            </div>
            <div className="flex justify-end pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="h-7 px-3 text-xs text-muted-foreground hover:text-foreground"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
