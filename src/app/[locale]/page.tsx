import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { PRICING_TIERS } from '@/lib/constants';

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
    { title: t('shareableLinks'), desc: t('shareableLinksDesc') },
    { title: t('embeddableWidgets'), desc: t('embeddableWidgetsDesc') },
    { title: t('videoTestimonials'), desc: t('videoTestimonialsDesc') },
    { title: t('emailCampaigns'), desc: t('emailCampaignsDesc') },
    { title: t('approveManage'), desc: t('approveManageDesc') },
    { title: t('customBranding'), desc: t('customBrandingDesc') },
  ];

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-gray-100">
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
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
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

      {/* How it works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t('howItWorks')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: t('step1Title'), desc: t('step1Desc') },
              { step: '2', title: t('step2Title'), desc: t('step2Desc') },
              { step: '3', title: t('step3Title'), desc: t('step3Desc') },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">{t('lovedByBusinesses')}</h2>
          <p className="text-center text-gray-600 mb-12">{t('seeWhatUsersSay')}</p>
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
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t('everythingYouNeed')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <Card key={f.title} className="hover:-translate-y-0.5 transition-all duration-200">
                <CardContent className="p-6">
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
          <h2 className="text-3xl font-bold text-center mb-4">{tp('simplePricing')}</h2>
          <p className="text-center text-gray-600 mb-12">{tp('startFreeUpgrade')}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier) => (
              <Card
                key={tier.plan}
                className={`hover:-translate-y-1 hover:shadow-lg transition-all duration-200${tier.plan === 'creator' ? ' border-indigo-600 border-2 relative' : ''}`}
              >
                {tier.plan === 'creator' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    {tp('mostPopular')}
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold">{tp(tier.plan)}</h3>
                  <div className="mt-2 mb-6">
                    <span className="text-4xl font-bold">${tier.price}</span>
                    {tier.price > 0 && <span className="text-gray-500">{tp('perMonth')}</span>}
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

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t('faqTitle')}</h2>
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
      <section className="py-20 px-4 bg-indigo-600">
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
      <footer className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-gray-500">
          <span>ProofPulse</span>
          <span>{t('builtWith')}</span>
        </div>
      </footer>
    </div>
  );
}
