import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface DetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function InspirationDetailPage({ params }: DetailPageProps) {
  const { locale, slug } = await params;
  redirect(`/${locale}/ui/${slug}`);
}
