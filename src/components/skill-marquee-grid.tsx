import Link from "next/link";
import Image from "next/image";
import { Star, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Skill, Category } from "@/db/schema";
import { formatCount } from "@/lib/format";

interface SkillItemWithCategory {
  skill: Skill;
  category: Category | null;
}

interface SkillMarqueeGridProps {
  skills: SkillItemWithCategory[];
  locale: string;
}

function getSlugHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
}

function getSkillThumbnail(skill: Skill, title: string): string {
  const customImages = Array.isArray(skill.images)
    ? skill.images.filter(
        (img): img is string =>
          typeof img === "string" &&
          img.trim().length > 0 &&
          !img.includes("default-skill.png")
      )
    : [];

  if (customImages.length > 0) {
    return customImages[0];
  }

  if (
    typeof skill.previewImageUrl === "string" &&
    skill.previewImageUrl.trim().length > 0 &&
    !skill.previewImageUrl.includes("default-skill.png")
  ) {
    return skill.previewImageUrl;
  }

  const hue1 = getSlugHue(skill.slug);
  const hue2 = (hue1 + 45) % 360;
  const initial = (title || skill.slug).trim().charAt(0).toUpperCase() || "S";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="hsl(${hue1},70%,16%)"/><stop offset="100%" stop-color="hsl(${hue2},75%,8%)"/></linearGradient><radialGradient id="glow" cx="50%" cy="45%" r="60%"><stop offset="0%" stop-color="hsl(${hue1},80%,45%)" stop-opacity="0.35"/><stop offset="100%" stop-color="hsl(${hue2},80%,20%)" stop-opacity="0"/></radialGradient><pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/></pattern></defs><rect width="400" height="400" fill="url(#bg)"/><rect width="400" height="400" fill="url(#grid)"/><circle cx="200" cy="180" r="140" fill="url(#glow)"/><text x="200" y="210" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="124" font-weight="900" fill="rgba(255,255,255,0.92)" text-anchor="middle" dominant-baseline="middle">${initial}</text></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function padRowItems(items: SkillItemWithCategory[], minCount = 8): SkillItemWithCategory[] {
  if (items.length === 0) return [];
  const result: SkillItemWithCategory[] = [];
  while (result.length < minCount) {
    for (const item of items) {
      result.push(item);
      if (result.length >= minCount) break;
    }
  }
  return result;
}

function SkillCell({
  item,
  locale,
  isEn,
  ariaHidden,
  tabIndex,
}: {
  item: SkillItemWithCategory;
  locale: string;
  isEn: boolean;
  ariaHidden?: boolean;
  tabIndex?: number;
}) {
  const { skill, category } = item;
  const title = isEn ? skill.titleEn : skill.titleId;
  const categoryName = category
    ? isEn
      ? category.nameEn
      : category.nameId
    : isEn
    ? "Skill"
    : "Skill";

  const fm = (skill.frontmatter as { stars?: number } | null) || null;
  const starCount = fm?.stars ? formatCount(fm.stars) : skill.copyCount > 0 ? formatCount(skill.copyCount) : "4.8k";
  const cover = getSkillThumbnail(skill, title);

  return (
    <Link
      href={`/${locale}/skills/${skill.slug}`}
      tabIndex={tabIndex}
      aria-hidden={ariaHidden}
      className="marquee-cell relative block aspect-square overflow-hidden bg-surface group rounded-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground cursor-pointer select-none"
    >
      <Image
        src={cover}
        alt=""
        fill
        sizes="(min-width: 1024px) 25vw, 50vw"
        loading="lazy"
        unoptimized
        className="object-cover rounded-none transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 pointer-events-none rounded-none" />

      <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-black/60 backdrop-blur-xs text-white/90 border border-white/10 rounded-none tracking-wider font-medium">
          {categoryName}
        </span>
      </div>

      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 space-y-1 pointer-events-none">
        <div className="flex items-center gap-1 text-[11px] font-mono text-amber-300">
          <Star className="w-3 h-3 fill-amber-300 text-amber-300 shrink-0" aria-hidden="true" />
          <span>{starCount}</span>
        </div>
        <h3 className="text-xs sm:text-sm font-semibold text-white tracking-tight leading-snug line-clamp-2">
          {title}
        </h3>
      </div>
    </Link>
  );
}

export async function SkillMarqueeGrid({ skills, locale }: SkillMarqueeGridProps) {
  if (!skills || skills.length === 0) return null;

  const t = await getTranslations("marquee");
  const isEn = locale === "en";

  const row0Raw: SkillItemWithCategory[] = [];
  const row1Raw: SkillItemWithCategory[] = [];
  const row2Raw: SkillItemWithCategory[] = [];

  skills.forEach((item, index) => {
    if (index % 3 === 0) row0Raw.push(item);
    else if (index % 3 === 1) row1Raw.push(item);
    else row2Raw.push(item);
  });

  const row0 = padRowItems(row0Raw.length > 0 ? row0Raw : skills, 8);
  const row1 = padRowItems(row1Raw.length > 0 ? row1Raw : skills, 8);
  const row2 = padRowItems(row2Raw.length > 0 ? row2Raw : skills, 8);

  const rows = [
    { items: row0, trackClass: "marquee-track-1" },
    { items: row1, trackClass: "marquee-track-2" },
    { items: row2, trackClass: "marquee-track-3" },
  ];

  return (
    <section aria-labelledby="marquee-heading" className="w-full space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-foreground" />
          <h2
            id="marquee-heading"
            className="text-xs sm:text-sm font-semibold tracking-tight text-foreground"
          >
            {t("title")}
          </h2>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[4px] bg-muted text-muted-foreground border border-border/60">
            {skills.length} skills
          </span>
        </div>
        <p className="text-xs text-muted-foreground hidden sm:block">
          {t("subtitle")}
        </p>
      </div>

      <div className="marquee-grid-wrapper w-full overflow-hidden border border-border bg-border rounded-none shadow-xs">
        <div className="flex flex-col gap-px">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="marquee-row overflow-hidden">
              <div className={`marquee-track ${row.trackClass}`}>
                {row.items.map((item, idx) => (
                  <SkillCell
                    key={`orig-${rowIndex}-${idx}-${item.skill.id}`}
                    item={item}
                    locale={locale}
                    isEn={isEn}
                  />
                ))}
                {row.items.map((item, idx) => (
                  <SkillCell
                    key={`dup-${rowIndex}-${idx}-${item.skill.id}`}
                    item={item}
                    locale={locale}
                    isEn={isEn}
                    ariaHidden={true}
                    tabIndex={-1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
