import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BrandLogo } from "./brand-logo";
import { FeedbackModal } from "./feedback-modal";
import { Layers, FileCode, Star, Plus, Sparkles, LogIn, ExternalLink, TrendingUp, Boxes, Palette } from "lucide-react";
import type { PublicUser } from "./public-user-nav";

export async function PublicFooter({
  locale,
  user,
}: {
  locale: string;
  user?: PublicUser | null;
}) {
  const t = await getTranslations("footer");
  const isEn = locale === "en";

  return (
    <footer className="w-full border-t border-border/80 bg-background/95 backdrop-blur-xs mt-auto">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2.5 text-foreground hover:opacity-85 transition-opacity"
            >
              <BrandLogo className="w-7 h-7" size={28} />
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-wider uppercase">Skills</span>
                <span className="text-[10px] text-muted-foreground font-mono">skills.biz.id</span>
              </div>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              {isEn
                ? "The open directory of verified AI agent skills, prompts, and developer workflows."
                : "Direktori terbuka untuk kurasi skill agen AI, templat prompt, dan alur kerja developer terverifikasi."}
            </p>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[5px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isEn ? "All systems operational" : "Semua sistem operasional"}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              {isEn ? "Explore" : "Jelajah"}
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href={`/${locale}/skills`}
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <Layers className="w-3 h-3" />
                  <span>{isEn ? "Skills Catalog" : "Katalog Skill"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/prompts`}
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <FileCode className="w-3 h-3" />
                  <span>{isEn ? "Prompt Library" : "Pustaka Prompt"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/trending`}
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <TrendingUp className="w-3 h-3 text-foreground" />
                  <span>{isEn ? "GitHub Trending 100" : "Trending GitHub 100"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/mcp`}
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <Boxes className="w-3 h-3 text-foreground" />
                  <span>{isEn ? "139 MCP Servers" : "139 Server MCP"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/inspirasi`}
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <Palette className="w-3 h-3 text-foreground" />
                  <span>{isEn ? "UI/UX Inspiration" : "Inspirasi UI/UX"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/favorites`}
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                  <span>{isEn ? "Saved Favorites" : "Koleksi Favorit"}</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              {isEn ? "Contribute" : "Kontribusi"}
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href={`/${locale}/skills/submit`}
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isEn ? "Submit a Skill" : "Kirimkan Skill"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/prompts/submit`}
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isEn ? "Submit Prompt" : "Kirimkan Prompt"}</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/dresar/ProSkillAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              {isEn ? "Account & Community" : "Akun & Komunitas"}
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/login"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1.5 font-medium text-foreground"
                >
                  <LogIn className="w-3 h-3" />
                  <span>{isEn ? "Sign In to Account" : "Masuk ke Akun"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="hover:text-foreground transition-colors"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="hover:text-foreground transition-colors"
                >
                  {t("terms")}
                </Link>
              </li>
              <li className="pt-1">
                <FeedbackModal locale={locale} user={user} />
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Skills.biz.id.</span>
            <span>{t("rights")}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-muted-foreground">
              {isEn ? "Curated with anti-slop standards" : "Dicurasi dengan standar anti-slop"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
