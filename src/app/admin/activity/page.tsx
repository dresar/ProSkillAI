import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getAdminActivityLogs } from "@/db/queries";

export default async function AdminActivityPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/admin");
  }

  const logs = await getAdminActivityLogs(50);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Log Aktivitas & Audit Keamanan
        </h2>
        <p className="text-xs text-neutral-500">
          Catatan riwayat setiap tindakan penting (siapa, apa, kapan, dan entitas yang dipengaruhi).
        </p>
      </div>

      <div className="rounded-md border border-border bg-surface overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/60 text-muted-foreground">
            <tr>
              <th className="p-3 font-medium text-foreground">Aksi</th>
              <th className="p-3 font-medium text-foreground">Pengguna</th>
              <th className="p-3 font-medium text-foreground">Tipe Entitas</th>
              <th className="p-3 font-medium text-foreground">Waktu</th>
              <th className="p-3 font-medium text-foreground">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/40 transition-colors">
                <td className="p-3 font-mono font-medium text-foreground">
                  {log.action}
                </td>
                <td className="p-3 text-muted-foreground">
                  {log.userEmail || "System"}
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded border border-border bg-muted text-foreground text-[11px] font-mono">
                    {log.entityType} {log.entityId ? `(#${log.entityId.slice(0, 8)})` : ""}
                  </span>
                </td>
                <td className="p-3 font-mono text-muted-foreground text-[11px]">
                  {new Date(log.createdAt).toLocaleString("id-ID")}
                </td>
                <td className="p-3 text-[11px] font-mono text-muted-foreground max-w-xs truncate">
                  {log.details ? JSON.stringify(log.details) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
