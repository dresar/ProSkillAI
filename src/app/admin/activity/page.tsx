import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getAdminActivityLogs } from "@/db/queries";
import { ActivityClient } from "./activity-client";

export const dynamic = "force-dynamic";

export default async function AdminActivityPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/admin");
  }

  const logs = await getAdminActivityLogs(100);

  return <ActivityClient initialLogs={logs} userRole={user.role} />;
}
