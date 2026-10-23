import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Panel — ProSkillAI",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?redirect=/admin");
  }

  if (user.role !== "admin" && user.role !== "editor") {
    redirect("/id");
  }

  return (
    <div className="h-screen h-dvh bg-background flex flex-col lg:flex-row overflow-hidden">
      <AdminSidebar userRole={user.role} />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <AdminHeader userEmail={user.email} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7">
          <div className="w-full max-w-[1536px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
