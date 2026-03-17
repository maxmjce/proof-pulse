import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PRICING_TIERS } from '@/lib/constants';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const DEMO_TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    title: 'Founder, DesignLab',
    content: 'ProofPulse made it so easy to collect testimonials from our clients. We saw a 23% increase in conversions after adding the widget to our landing page.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    title: 'Freelance Developer',
    content: 'I used to manually ask for reviews via email. Now I just send a ProofPulse link and testimonials roll in. The embed widget looks amazing on my portfolio.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    title: 'Course Creator',
    content: 'The automated email campaigns are a game-changer. After each course completion, students get a request and I get authentic testimonials without lifting a finger.',
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600">ProofPulse</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Log in
            </Link>
            <Button asChild size="sm">
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Turn happy customers into
            <span className="text-indigo-600"> your best marketing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Collect testimonials with a simple link. Display them anywhere with a beautiful embed widget. Automate the whole thing with email campaigns.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/signup">Start Collecting Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#pricing">See Pricing</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-400">No credit card required. Free forever plan available.</p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Create a form', desc: 'Build a testimonial collection form in seconds. Share the link with customers.' },
              { step: '2', title: 'Collect testimonials', desc: 'Customers submit text, ratings, and video testimonials through your branded form.' },
              { step: '3', title: 'Display everywhere', desc: 'Embed a beautiful widget on your site. Copy-paste one line of code.' },
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
          <h2 className="text-3xl font-bold text-center mb-4">Loved by businesses</h2>
          <p className="text-center text-gray-600 mb-12">See what our users are saying</p>
          <div className="grid md:grid-cols-3 gap-6">
            {DEMO_TESTIMONIALS.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-6">
                  <StarRating rating={t.rating} />
                  <p className="mt-4 text-gray-700">&ldquo;{t.content}&rdquo;</p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.title}</p>
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
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Shareable Collection Links', desc: 'Create branded forms and share a simple link. No login required for reviewers.' },
              { title: 'Embeddable Widgets', desc: 'Carousel, wall, or badge. Copy one line of code to display on any website.' },
              { title: 'Video Testimonials', desc: 'Let customers record video testimonials directly from your collection form.' },
              { title: 'Email Campaigns', desc: 'Automatically request testimonials after purchase or project completion.' },
              { title: 'Approve & Manage', desc: 'Review, approve, tag, and feature your best testimonials from one dashboard.' },
              { title: 'Custom Branding', desc: 'Match your brand colors, add your logo, remove ProofPulse branding on paid plans.' },
            ].map((f) => (
              <Card key={f.title}>
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
          <h2 className="text-3xl font-bold text-center mb-4">Simple pricing</h2>
          <p className="text-center text-gray-600 mb-12">Start free. Upgrade when you need more.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier) => (
              <Card key={tier.plan} className={tier.plan === 'creator' ? 'border-indigo-600 border-2 relative' : ''}>
                {tier.plan === 'creator' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold">{tier.name}</h3>
                  <div className="mt-2 mb-6">
                    <span className="text-4xl font-bold">${tier.price}</span>
                    {tier.price > 0 && <span className="text-gray-500">/month</span>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={tier.plan === 'creator' ? 'default' : 'outline'}
                    className="w-full"
                  >
                    <Link href="/signup">
                      {tier.price === 0 ? 'Get Started Free' : 'Start Free Trial'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-indigo-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to turn testimonials into conversions?
          </h2>
          <p className="text-indigo-100 mb-8">
            Join thousands of businesses using ProofPulse to showcase their social proof.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/signup">Start Collecting Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-gray-500">
          <span>ProofPulse</span>
          <span>Built with Next.js, Supabase & Stripe</span>
        </div>
      </footer>
    </div>
  );
}
