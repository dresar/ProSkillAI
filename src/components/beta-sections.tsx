import { getTranslations } from "next-intl/server";

type BetaKey = "teardowns" | "patterns" | "guides" | "glossary" | "tools" | "inspirations";

interface BetaItem {
  key: BetaKey;
  descKey: "teardownsDesc" | "patternsDesc" | "guidesDesc" | "glossaryDesc" | "toolsDesc" | "inspirationsDesc";
}

const BETA_LIST: BetaItem[] = [
  { key: "teardowns", descKey: "teardownsDesc" },
  { key: "patterns", descKey: "patternsDesc" },
  { key: "guides", descKey: "guidesDesc" },
  { key: "glossary", descKey: "glossaryDesc" },
  { key: "tools", descKey: "toolsDesc" },
  { key: "inspirations", descKey: "inspirationsDesc" },
];

export async function BetaSections() {
  const t = await getTranslations("beta");
  const homeT = await getTranslations("home");

  return (
    <section className="mt-16 pt-12 border-t border-border" aria-labelledby="beta-heading">
      <div className="mb-6">
        <h2 id="beta-heading" className="text-base font-semibold text-foreground tracking-tight">
          {homeT("betaTitle")}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-xl">
          {homeT("betaSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {BETA_LIST.map(({ key, descKey }) => (
          <div
            key={key}
            className="p-3.5 rounded-md border border-border bg-muted/30 text-muted-foreground select-none"
            aria-disabled="true"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold text-foreground">{t(key)}</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded border border-border bg-surface text-muted-foreground">
                {t("status")}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              {t(descKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
