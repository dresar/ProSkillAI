import Link from "next/link";
import type { Prompt, Category } from "@/db/schema";

interface PromptCardProps {
  prompt: Prompt;
  category?: Category | null;
  locale: string;
}

export function PromptCard({ prompt, category, locale }: PromptCardProps) {
  const isEn = locale === "en";
  const title = isEn ? prompt.titleEn : prompt.titleId;
  const description = isEn ? prompt.descriptionEn : prompt.descriptionId;
  const categoryName = category
    ? isEn
      ? category.nameEn
      : category.nameId
    : null;

  const variableList = Array.isArray(prompt.variables) ? prompt.variables : [];
  const varCountText =
    variableList.length > 0
      ? isEn
        ? `${variableList.length} variables`
        : `${variableList.length} variabel`
      : null;

  return (
    <Link
      href={`/${locale}/prompts/${prompt.slug}`}
      className="group block rounded-md border border-border bg-surface p-4 hover:border-foreground/30 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
    >
      <h3 className="text-sm font-semibold text-foreground tracking-tight group-hover:underline">
        {title}
      </h3>

      <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {description}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 truncate">
          {categoryName && <span>{categoryName}</span>}
          {categoryName && varCountText && <span aria-hidden="true">&bull;</span>}
          {varCountText && <span>{varCountText}</span>}
        </div>
        {prompt.copyCount > 0 && (
          <span className="shrink-0 text-[11px] font-mono text-muted-foreground">
            {prompt.copyCount} {isEn ? "copies" : "salinan"}
          </span>
        )}
      </div>
    </Link>
  );
}
