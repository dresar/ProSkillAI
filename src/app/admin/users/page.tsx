import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getAdminUsers } from "@/db/queries";
import { UsersClient } from "./users-client";

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/admin");
  }

  const allUsers = await getAdminUsers();

  return <UsersClient usersList={allUsers} />;
}
