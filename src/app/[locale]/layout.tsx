import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { type Locale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://proofpulse.dev'),
    title: {
      default: t("title"),
      template: "%s | ProofPulse",
    },
    description: t("description"),
    keywords: [
      "testimonials", "social proof", "reviews", "widget", "embed",
      "customer feedback", "omdomen", "kundomdomen",
    ],
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: locale === "sv" ? "sv_SE" : "en_US",
      siteName: "ProofPulse",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      languages: {
        sv: "/sv",
        en: "/en",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
