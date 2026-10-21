import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

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
      <script
        dangerouslySetInnerHTML={{ __html: `document.documentElement.lang="${locale}";` }}
      />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-3 focus:bg-foreground focus:text-background focus:font-medium focus:outline-hidden"
      >
        {locale === "en" ? "Skip to main content" : "Lewati ke konten utama"}
      </a>

      <PublicHeader locale={locale} />
      <main id="main-content" className="flex-1 flex flex-col">
        {children}
      </main>
      <PublicFooter locale={locale} />
    </NextIntlClientProvider>
  );
}
