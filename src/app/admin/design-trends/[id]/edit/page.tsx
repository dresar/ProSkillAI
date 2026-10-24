import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getAdminUiInspirationById } from "@/db/queries";
import { DesignTrendForm } from "../../design-trend-form";
import { updateDesignTrendAction } from "../../actions";

export const dynamic = "force-dynamic";

interface EditDesignTrendPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDesignTrendPage({ params }: EditDesignTrendPageProps) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    redirect("/admin");
  }

  const { id } = await params;
  const item = await getAdminUiInspirationById(id);

  if (!item) {
    notFound();
  }

  const boundUpdateAction = updateDesignTrendAction.bind(null, id);

  return (
    <div className="py-2">
      <DesignTrendForm
        initialData={item}
        action={boundUpdateAction}
        title={`Edit Pola: ${item.titleEn}`}
      />
    </div>
  );
}
