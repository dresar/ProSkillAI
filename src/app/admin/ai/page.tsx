import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getStoredAiConfig, fetchBynaraModels } from "@/lib/ai";
import { AdminAiClient } from "./ai-client";
import { db } from "@/db";
import { users } from "@/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminAiPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/admin");
  }

  const [config, models, userStats] = await Promise.all([
    getStoredAiConfig(),
    fetchBynaraModels(),
    db
      .select({
        totalUsers: sql<number>`count(*)`,
        totalCredits: sql<number>`sum(${users.aiCredits})`,
      })
      .from(users),
  ]);

  return (
    <AdminAiClient
      initialConfig={config}
      models={models}
      stats={{
        totalUsers: Number(userStats[0]?.totalUsers ?? 0),
        totalCredits: Number(userStats[0]?.totalCredits ?? 0),
      }}
    />
  );
}