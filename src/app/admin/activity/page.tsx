import { getAdminActivityLogs } from "@/db/queries";

export default async function AdminActivityPage() {
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

      <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500">
            <tr>
              <th className="p-3 font-semibold text-foreground">Aksi</th>
              <th className="p-3 font-semibold text-foreground">Pengguna</th>
              <th className="p-3 font-semibold text-foreground">Tipe Entitas</th>
              <th className="p-3 font-semibold text-foreground">Waktu</th>
              <th className="p-3 font-semibold text-foreground">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                <td className="p-3 font-mono font-medium text-foreground">
                  {log.action}
                </td>
                <td className="p-3 text-neutral-600 dark:text-neutral-400">
                  {log.userEmail || "System"}
                </td>
                <td className="p-3">
                  <span className="px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-[11px]">
                    {log.entityType} {log.entityId ? `(#${log.entityId.slice(0, 8)})` : ""}
                  </span>
                </td>
                <td className="p-3 font-mono text-neutral-400 text-[11px]">
                  {new Date(log.createdAt).toLocaleString("id-ID")}
                </td>
                <td className="p-3 text-[11px] font-mono text-neutral-500 max-w-xs truncate">
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
