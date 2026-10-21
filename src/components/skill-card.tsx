import Link from "next/link";
import Image from "next/image";
import type { Skill, Category } from "@/db/schema";

interface SkillCardProps {
  skill: Skill;
  category?: Category | null;
  locale: string;
}

export function SkillCard({ skill, category, locale }: SkillCardProps) {
  const isEn = locale === "en";
  const title = isEn ? skill.titleEn : skill.titleId;
  const summary = isEn ? skill.summaryEn : skill.summaryId;
  const categoryName = category
    ? isEn
      ? category.nameEn
      : category.nameId
    : null;

  const sourceLabel =
    skill.sourceType === "github" && skill.repoUrl
      ? skill.repoUrl.replace("https://github.com/", "")
      : isEn
      ? "Original"
      : "Orisinal";

  return (
    <Link
      href={`/${locale}/skills/${skill.slug}`}
      className="group block rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface p-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
    >
      {skill.previewType === "tokens" && Boolean(skill.designTokens) && (
        <div className="mb-3 flex items-center gap-1.5 p-2 rounded bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
          {Array.isArray((skill.designTokens as { colors?: Array<{ hex: string }> })?.colors) &&
            (skill.designTokens as { colors: Array<{ hex: string }> }).colors
              .slice(0, 5)
              .map((c, i) => (
                <span
                  key={i}
                  className="w-4 h-4 rounded-xs border border-neutral-300 dark:border-neutral-700"
                  style={{ backgroundColor: c.hex }}
                  aria-hidden="true"
                />
              ))}
        </div>
      )}

      {skill.previewType === "image" && skill.previewImageUrl && (
        <div className="relative mb-3 aspect-video w-full overflow-hidden rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <Image
            src={skill.previewImageUrl}
            alt={title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-102 transition-transform duration-200"
          />
        </div>
      )}

      <h3 className="text-sm font-semibold text-foreground tracking-tight group-hover:underline">
        {title}
      </h3>

      <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
        {summary}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-1.5 truncate">
          {categoryName && <span>{categoryName}</span>}
          {categoryName && <span aria-hidden="true">&bull;</span>}
          <span className="truncate">{sourceLabel}</span>
        </div>
        {skill.copyCount > 0 && (
          <span className="shrink-0 text-[11px] font-mono text-neutral-400">
            {skill.copyCount} {isEn ? "copies" : "salinan"}
          </span>
        )}
      </div>
    </Link>
  );
}
