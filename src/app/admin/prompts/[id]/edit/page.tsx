import { notFound } from "next/navigation";
import { getAdminPromptById, getAllCategories } from "@/db/queries";
import { PromptForm } from "../../prompt-form";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPromptPage({ params }: PageProps) {
  const { id } = await params;

  const [prompt, allCategories] = await Promise.all([
    getAdminPromptById(id),
    getAllCategories("prompts"),
  ]);

  if (!prompt) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Edit Prompt: {prompt.titleId}
        </h2>
        <p className="text-xs text-neutral-500">
          Ubah konten, variabel dinamis, dan status publikasi prompt.
        </p>
      </div>

      <PromptForm initialPrompt={prompt} categories={allCategories} />
    </div>
  );
}
