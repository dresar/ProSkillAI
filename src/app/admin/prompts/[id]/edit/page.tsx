import { notFound } from "next/navigation";
import { db } from "@/db";
import { prompts, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PromptForm } from "../../prompt-form";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPromptPage({ params }: PageProps) {
  const { id } = await params;

  const found = await db.select().from(prompts).where(eq(prompts.id, id)).limit(1);
  const prompt = found[0];
  if (!prompt) {
    notFound();
  }

  const allCategories = await db.select().from(categories);

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
