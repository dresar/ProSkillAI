import { notFound } from "next/navigation";
import { db } from "@/db";
import { skills, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SkillForm } from "../../skill-form";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditSkillPage({ params }: PageProps) {
  const { id } = await params;

  const found = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
  const skill = found[0];
  if (!skill) {
    notFound();
  }

  const allCategories = await db.select().from(categories);

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
