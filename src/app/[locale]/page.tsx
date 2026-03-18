import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { PRICING_TIERS } from '@/lib/constants';
import { LandingPageJsonLd, FAQPageJsonLd } from '@/components/seo/json-ld';
import { ScrollFadeIn } from '@/components/landing/scroll-fade-in';
import { LinkIcon, LayoutGrid, Video, Mail, CheckCircle, Palette, Zap, Globe, TrendingUp } from 'lucide-react';

const PLAN_FEATURE_KEYS = {
  free: ['freeTestimonials', 'freeForm', 'freeWidget', 'freeBranding', 'freeAnalytics'],
  creator: ['creatorTestimonials', 'creatorForms', 'creatorWidgets', 'creatorBranding', 'creatorVideo', 'creatorCampaigns', 'creatorSupport'],
  business: ['businessTestimonials', 'businessForms', 'businessWidgets', 'businessWhiteLabel', 'businessVideo', 'businessCampaigns', 'businessApi', 'businessSupport'],
} as const;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('landing');
  const tp = await getTranslations('pricing');

  const DEMO_TESTIMONIALS = [
    { name: t('demo1Name'), title: t('demo1Title'), content: t('demo1Content'), rating: 5 },
    { name: t('demo2Name'), title: t('demo2Title'), content: t('demo2Content'), rating: 5 },
    { name: t('demo3Name'), title: t('demo3Title'), content: t('demo3Content'), rating: 5 },
  ];

  const FEATURES = [
    { title: t('shareableLinks'), desc: t('shareableLinksDesc'), icon: LinkIcon },
    { title: t('embeddableWidgets'), desc: t('embeddableWidgetsDesc'), icon: LayoutGrid },
    { title: t('videoTestimonials'), desc: t('videoTestimonialsDesc'), icon: Video },
    { title: t('emailCampaigns'), desc: t('emailCampaignsDesc'), icon: Mail },
    { title: t('approveManage'), desc: t('approveManageDesc'), icon: CheckCircle },
    { title: t('customBranding'), desc: t('customBrandingDesc'), icon: Palette },
  ];

  return (
    <div className="min-h-screen">
      <LandingPageJsonLd locale={locale} />
      <FAQPageJsonLd faqs={[
        { question: t('faq1Q'), answer: t('faq1A') },
        { question: t('faq2Q'), answer: t('faq2A') },
        { question: t('faq3Q'), answer: t('faq3A') },
        { question: t('faq4Q'), answer: t('faq4A') },
        { question: t('faq5Q'), answer: t('faq5A') },
      ]} />
      {/* Nav */}
      <nav className="border-b border-gray-100/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600">ProofPulse</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              {t('login')}
            </Link>
            <Link href="/" locale={locale === 'sv' ? 'en' : 'sv'} className="text-sm text-gray-500 hover:text-gray-700">
              {locale === 'sv' ? 'EN' : 'SV'}
            </Link>
            <Button asChild size="sm">
              <Link href="/signup">{t('getStarted')}</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient py-28 px-4 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
            {t('heroTitle')}
            <span className="text-indigo-600"> {t('heroTitleHighlight')}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('heroDescription')}
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/signup">{t('startCollecting')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#pricing">{t('seePricing')}</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-400">{t('noCreditCard')}</p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-12 px-4 border-y border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto">
          <ScrollFadeIn>
            <p className="text-center text-sm font-medium text-gray-500 mb-8">{t('statsTitle')}</p>
          </ScrollFadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: t('stat1Number'), label: t('stat1Label') },
              { number: t('stat2Number'), label: t('stat2Label') },
              { number: t('stat3Number'), label: t('stat3Label') },
              { number: t('stat4Number'), label: t('stat4Label') },
            ].map((stat, i) => (
              <ScrollFadeIn key={stat.label} delay={i * 100}>
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">{stat.number}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 section-gradient-1">
        <div className="max-w-5xl mx-auto">
          <ScrollFadeIn>
            <h2 className="text-3xl font-bold text-center mb-12">{t('howItWorks')}</h2>
          </ScrollFadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: t('step1Title'), desc: t('step1Desc') },
              { step: '2', title: t('step2Title'), desc: t('step2Desc') },
              { step: '3', title: t('step3Title'), desc: t('step3Desc') },
            ].map((item, i) => (
              <ScrollFadeIn key={item.step} delay={i * 150}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <ScrollFadeIn>
            <h2 className="text-3xl font-bold text-center mb-4">{t('lovedByBusinesses')}</h2>
            <p className="text-center text-gray-600 mb-12">{t('seeWhatUsersSay')}</p>
          </ScrollFadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {DEMO_TESTIMONIALS.map((testimonial) => (
              <Card key={testimonial.name}>
                <CardContent className="p-6">
                  <StarRating rating={testimonial.rating} size="sm" />
                  <p className="mt-4 text-gray-700">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 section-gradient-2">
        <div className="max-w-5xl mx-auto">
          <ScrollFadeIn>
            <h2 className="text-3xl font-bold text-center mb-12">{t('everythingYouNeed')}</h2>
          </ScrollFadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <Card key={f.title} className="hover:-translate-y-0.5 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                    <f.icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">{t('simplePricing')}</h2>
          <p className="text-center text-gray-600 mb-12">{t('startFreeUpgrade')}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier) => (
              <Card
                key={tier.plan}
                className={`hover:-translate-y-1 hover:shadow-lg transition-all duration-200${tier.plan === 'creator' ? ' border-indigo-600 border-2 relative' : ''}`}
              >
                {tier.plan === 'creator' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    {t('mostPopular')}
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold">{tp(tier.plan)}</h3>
                  <div className="mt-2 mb-6">
                    <span className="text-4xl font-bold">{tier.price === 0 ? '0' : tier.price} kr</span>
                    {tier.price > 0 && <span className="text-gray-500">{t('perMonth')}</span>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {PLAN_FEATURE_KEYS[tier.plan as keyof typeof PLAN_FEATURE_KEYS].map((key) => (
                      <li key={key} className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {tp(`features.${key}`)}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={tier.plan === 'creator' ? 'default' : 'outline'}
                    className="w-full"
                  >
                    <Link href="/signup">
                      {tier.price === 0 ? t('getStarted') : t('startCollecting')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why ProofPulse */}
      <section className="py-20 px-4 section-gradient-1">
        <div className="max-w-5xl mx-auto">
          <ScrollFadeIn>
            <h2 className="text-3xl font-bold text-center mb-12">{t('whyTitle')}</h2>
          </ScrollFadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t('why1Title'), desc: t('why1Desc'), icon: Zap },
              { title: t('why2Title'), desc: t('why2Desc'), icon: Globe },
              { title: t('why3Title'), desc: t('why3Desc'), icon: TrendingUp },
            ].map((item, i) => (
              <ScrollFadeIn key={item.title} delay={i * 150}>
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <ScrollFadeIn>
            <h2 className="text-3xl font-bold text-center mb-12">{t('faqTitle')}</h2>
          </ScrollFadeIn>
          <div className="space-y-4">
            {[
              { q: t('faq1Q'), a: t('faq1A') },
              { q: t('faq2Q'), a: t('faq2A') },
              { q: t('faq3Q'), a: t('faq3A') },
              { q: t('faq4Q'), a: t('faq4A') },
              { q: t('faq5Q'), a: t('faq5A') },
            ].map((faq) => (
              <div key={faq.q} className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 cta-gradient">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('readyToConvert')}
          </h2>
          <p className="text-indigo-100 mb-8">
            {t('joinThousands')}
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/signup">{t('startCollecting')}</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span className="font-semibold text-gray-700">ProofPulse</span>
          <span>{t('builtWith')}</span>
        </div>
      </footer>
    </div>
  );
}
