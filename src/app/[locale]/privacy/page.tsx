import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    title: isEn ? "Privacy Policy" : "Kebijakan Privasi",
    description: isEn
      ? "Privacy policy and data transparency statement of ProSkillAI."
      : "Kebijakan privasi dan transparansi data ProSkillAI.",
    alternates: {
      canonical: `https://proskillai.dev/${locale}/privacy`,
      languages: {
        id: "https://proskillai.dev/id/privacy",
        en: "https://proskillai.dev/en/privacy",
        "x-default": "https://proskillai.dev/id/privacy",
      },
    },
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  return (
    <div className="w-full max-w-4xl px-4 sm:px-6 py-4 sm:py-5 space-y-5">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {isEn ? "Privacy Policy" : "Kebijakan Privasi"}
      </h1>

      <div className="prose prose-neutral dark:prose-invert text-xs sm:text-sm leading-relaxed space-y-4">
        {isEn ? (
          <>
            <p>
              ProSkillAI is a public catalog of AI agent skills and engineering prompts. We believe in minimal data footprint, radical transparency, and zero behavioral trackers.
            </p>
            <h2 className="text-sm font-semibold text-foreground pt-2">Data We Collect</h2>
            <p>
              Public visitors can browse, search, preview, and download skills anonymously without creating an account. We do not store cookies on public visitors. For authenticated admin and editor staff, we store only session authentication cookies required to maintain login state securely.
            </p>
            <h2 className="text-sm font-semibold text-foreground pt-2">External Content & Security</h2>
            <p>
              When previewing HTML or CSS skills, all content is isolated inside a sandboxed iframe with strict Content Security Policy and zero JavaScript execution privileges.
            </p>
          </>
        ) : (
          <>
            <p>
              ProSkillAI adalah katalog publik skill AI agent dan prompt rekayasa. Kami menerapkan jejak data minimal, transparansi penuh, dan bebas dari pelacak perilaku pengguna.
            </p>
            <h2 className="text-sm font-semibold text-foreground pt-2">Data yang Kami Kumpulkan</h2>
            <p>
              Pengunjung publik dapat menelusuri, mencari, mempratinjau, dan mengunduh skill secara anonim tanpa perlu mendaftar atau login. Kami tidak memasang cookie pada pengunjung publik. Bagi staf admin dan editor yang login, kami hanya menyimpan cookie sesi httpOnly yang diperlukan untuk otentikasi.
            </p>
            <h2 className="text-sm font-semibold text-foreground pt-2">Keamanan Pratinjau Konten</h2>
            <p>
              Semua pratinjau HTML atau CSS diisolasi di dalam iframe dengan atribut sandbox kosong dan Content Security Policy yang ketat tanpa akses script atau cookie origin.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
