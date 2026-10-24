import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface InspirasiPageProps {
  params: Promise<{ locale: string }>;
}

export default async function InspirasiPage({ params }: InspirasiPageProps) {
  const { locale } = await params;
  redirect(`/${locale}/ui`);
}
