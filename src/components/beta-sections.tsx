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
    <section className="mt-14 pt-8 border-t border-border" aria-labelledby="beta-heading">
      <div className="mb-5">
        <h2 id="beta-heading" className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
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
            className="p-4 rounded-xl border border-border bg-muted/20 text-muted-foreground select-none"
            aria-disabled="true"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold text-foreground">{t(key)}</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
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
