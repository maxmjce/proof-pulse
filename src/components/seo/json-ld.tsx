export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LandingPageJsonLd({ locale }: { locale: string }) {
  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ProofPulse",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: locale === "sv"
      ? "Det enklaste sattet att samla, hantera och visa kundomdomen med snygga widgetar."
      : "The simplest way to collect, manage, and showcase customer testimonials with beautiful widgets.",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        name: "Free",
      },
      {
        "@type": "Offer",
        price: "19",
        priceCurrency: "USD",
        name: "Creator",
      },
      {
        "@type": "Offer",
        price: "49",
        priceCurrency: "USD",
        name: "Business",
      },
    ],
  };

  return <JsonLd data={softwareApp} />;
}

export function FAQPageJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return <JsonLd data={faqSchema} />;
}
