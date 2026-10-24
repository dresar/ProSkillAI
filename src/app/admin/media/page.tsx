import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUploadedMediaList } from "./actions";
import { MediaClient } from "./media-client";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    redirect("/admin");
  }

  const items = await getUploadedMediaList();

  return <MediaClient initialItems={items} />;
}
