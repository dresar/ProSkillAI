import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function PublicFooter({ locale }: { locale: string }) {
  const t = await getTranslations("footer");

  return (
    <footer className="w-full border-t border-border bg-background mt-auto">
      <div className="w-full px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} ProSkillAI.</span>
          <span>{t("rights")}</span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href={`/${locale}/privacy`}
            className="hover:text-foreground transition-colors"
          >
            {t("privacy")}
          </Link>
          <Link
            href={`/${locale}/terms`}
            className="hover:text-foreground transition-colors"
          >
            {t("terms")}
          </Link>
          <Link
            href="/login"
            className="hover:text-foreground transition-colors opacity-80"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
