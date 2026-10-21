import { notFound } from "next/navigation";
import { getAdminSkillById, getAllCategories } from "@/db/queries";
import { SkillForm } from "../../skill-form";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditSkillPage({ params }: PageProps) {
  const { id } = await params;

  const [skill, allCategories] = await Promise.all([
    getAdminSkillById(id),
    getAllCategories("skills"),
  ]);

  if (!skill) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Edit Skill: {skill.titleId}
        </h2>
        <p className="text-xs text-neutral-500">
          Ubah konten, status publikasi, dan pengaturan pratinjau visual.
        </p>
      </div>

      <SkillForm initialSkill={skill} categories={allCategories} />
    </div>
  );
}
