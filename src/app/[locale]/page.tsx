import { Portfolio } from "@/components/v2/portfolio";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <Portfolio locale={locale === "en" ? "en" : "es"} />;
}
