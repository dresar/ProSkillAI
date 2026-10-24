import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DesignTrendForm } from "../design-trend-form";
import { createDesignTrendAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewDesignTrendPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    redirect("/admin");
  }

  return (
    <div className="py-2">
      <DesignTrendForm action={createDesignTrendAction} title="Tambah Pola Design Trend Baru" />
    </div>
  );
}
