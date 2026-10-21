import Link from "next/link";
import type { Prompt, Category } from "@/db/schema";

interface PromptCardProps {
  prompt: Prompt;
  category?: Category | null;
  locale: string;
}

export function PromptCard({ prompt, category, locale }: PromptCardProps) {
  const title = locale === "en" ? prompt.titleEn : prompt.titleId;
  const description = locale === "en" ? prompt.descriptionEn : prompt.descriptionId;
  const categoryName = category
    ? locale === "en"
      ? category.nameEn
      : category.nameId
    : null;

  const variableList = Array.isArray(prompt.variables) ? prompt.variables : [];
  const varCountText =
    variableList.length > 0
      ? locale === "en"
        ? `${variableList.length} variables`
        : `${variableList.length} variabel`
      : null;

  return (
    <Link
      href={`/${locale}/prompts/${prompt.slug}`}
      className="group block rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface p-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
    >
      <h3 className="text-sm font-semibold text-foreground tracking-tight group-hover:underline">
        {title}
      </h3>

      <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
        {description}
      </p>

      <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        {categoryName && <span>{categoryName}</span>}
        {categoryName && varCountText && <span aria-hidden="true">&bull;</span>}
        {varCountText && <span>{varCountText}</span>}
      </div>
    </Link>
  );
}
