import { getAllCategories, getSkillOptions } from "@/db/queries";
import { PromptForm } from "../prompt-form";

export default async function NewPromptPage() {
  const [allCategories, skillOptions] = await Promise.all([
    getAllCategories("prompts"),
    getSkillOptions(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Buat Prompt Baru
        </h2>
        <p className="text-xs text-neutral-500">
          Buat prompt dengan teks orisinal dalam dua bahasa dan konfigurasi variabel dinamis.
        </p>
      </div>

      <PromptForm categories={allCategories} skillOptions={skillOptions} />
    </div>
  );
}
