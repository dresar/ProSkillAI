import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/auth";
import { PublicSidebar } from "@/components/public-sidebar";
import { PublicMobileHeader } from "@/components/public-mobile-header";
import { PublicTopBar } from "@/components/public-top-bar";
import { PublicFooter } from "@/components/public-footer";
import { HtmlLangSetter } from "@/components/html-lang-setter";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const user = await getCurrentUser();
  const sessionUser = user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    : null;

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ProSkillAI",
    url: `https://proskillai.dev/${locale}`,
    potentialAction: {
      "@type": "SearchAction",
      target: `https://proskillai.dev/${locale}/skills?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ProSkillAI",
    url: "https://proskillai.dev",
    logo: "https://proskillai.dev/brand/logo-full.svg",
  };

  return (
    <NextIntlClientProvider messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HtmlLangSetter locale={locale} />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-3 focus:bg-foreground focus:text-background focus:font-medium focus:outline-hidden"
      >
        {locale === "en" ? "Skip to main content" : "Lewati ke konten utama"}
      </a>

      <div className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground relative transition-colors duration-200">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full blur-[110px] opacity-35 dark:opacity-40 pointer-events-none transition-all duration-500"
            style={{ background: "radial-gradient(ellipse at center, var(--accent) 0%, transparent 70%)" }}
          />
          <div className="absolute inset-0 bg-grid-lines bg-grid-mask opacity-70 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background pointer-events-none" />
        </div>
        <div className="relative z-20 shrink-0">
          <PublicSidebar locale={locale} user={sessionUser} />
        </div>
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <PublicMobileHeader locale={locale} user={sessionUser} />
          <PublicTopBar locale={locale} user={sessionUser} />
          <main id="main-content" className="flex-1 flex flex-col">
            {children}
          </main>
          <PublicFooter locale={locale} />
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
