import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import { UsersClient } from "./users-client";

export default async function AdminUsersPage() {
  await requireAdmin();
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

  return <UsersClient usersList={allUsers} />;
}
