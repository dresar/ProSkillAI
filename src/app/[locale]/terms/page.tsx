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
    title: isEn ? "Terms of Service" : "Ketentuan Layanan",
    description: isEn
      ? "Terms of service and license notice of ProSkillAI."
      : "Ketentuan layanan dan ketentuan lisensi ProSkillAI.",
    alternates: {
      canonical: `https://proskillai.dev/${locale}/terms`,
      languages: {
        id: "https://proskillai.dev/id/terms",
        en: "https://proskillai.dev/en/terms",
        "x-default": "https://proskillai.dev/id/terms",
      },
    },
  };
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  return (
    <div className="w-full max-w-4xl px-4 sm:px-6 py-4 sm:py-5 space-y-5">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {isEn ? "Terms of Service" : "Ketentuan Layanan"}
      </h1>

      <div className="prose prose-neutral dark:prose-invert text-xs sm:text-sm leading-relaxed space-y-4">
        {isEn ? (
          <>
            <p>
              By accessing ProSkillAI, you agree to comply with these terms. All skills and prompt materials are provided for software engineering and productivity purposes.
            </p>
            <h2 className="text-sm font-semibold text-foreground pt-2">License & Provenance</h2>
            <p>
              Skills imported from third-party repositories retain their original open-source license (such as MIT, Apache-2.0, or BSD) as declared by their creators. Original ProSkillAI skills and prompts are licensed under the MIT License unless stated otherwise.
            </p>
            <h2 className="text-sm font-semibold text-foreground pt-2">Disclaimer of Warranties</h2>
            <p>
              All skills, instructions, and prompt configurations are provided &ldquo;as is&rdquo; without warranty of any kind. You are responsible for reviewing AI outputs prior to deployment in production environments.
            </p>
          </>
        ) : (
          <>
            <p>
              Dengan mengakses ProSkillAI, Anda menyetujui ketentuan ini. Seluruh skill dan materi prompt disediakan untuk tujuan rekayasa perangkat lunak dan produktivitas agen AI.
            </p>
            <h2 className="text-sm font-semibold text-foreground pt-2">Lisensi & Atribusi</h2>
            <p>
              Skill yang diimpor dari repository pihak ketiga mempertahankan lisensi open-source aslinya (seperti MIT, Apache-2.0, atau BSD) sesuai penetapan pemilik aslinya. Konten orisinal ProSkillAI berlisensi MIT kecuali dinyatakan lain.
            </p>
            <h2 className="text-sm font-semibold text-foreground pt-2">Batasan Tanggung Jawab</h2>
            <p>
              Seluruh skill, instruksi, dan prompt disediakan &ldquo;apa adanya&rdquo; tanpa jaminan apa pun. Pengguna bertanggung jawab penuh memeriksa hasil kerja agen AI sebelum diterapkan ke sistem produksi.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
