import { getAllCategories } from "@/db/queries";
import { SkillForm } from "../skill-form";

export default async function NewSkillPage() {
  const allCategories = await getAllCategories("skills");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Buat Skill AI Agent Baru
        </h2>
        <p className="text-xs text-neutral-500">
          Tulis instruksi dalam bahasa Indonesia dan Inggris.
        </p>
      </div>

      <SkillForm categories={allCategories} />
    </div>
  );
}
