import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getAdminUiInspirations } from "@/db/queries";
import { DesignTrendsClient } from "./design-trends-client";

export const dynamic = "force-dynamic";

export default async function AdminDesignTrendsPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    redirect("/admin");
  }

  const items = await getAdminUiInspirations();

  return <DesignTrendsClient initialItems={items} userRole={user.role} />;
}
