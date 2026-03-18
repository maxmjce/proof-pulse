'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Profile, Plan } from '@/types';
import { PRICING_TIERS, PLAN_LIMITS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const tc = useTranslations('common');
  const { toast } = useToast();

  const [profile, setProfile] = useState<(Profile & { email?: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const json = await res.json();
        setProfile(json.data);
        setFullName(json.data.full_name || '');
        setCompanyName(json.data.company_name || '');
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: fullName,
        company_name: companyName || null,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      setProfile((prev) => prev ? { ...prev, ...json.data } : null);
      toast({ title: t('profileSaved'), variant: 'success' });
    }
    setSaving(false);
  }

  async function handleCheckout(plan: Plan) {
    setCheckingOut(plan);
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
        return;
      }
    }
    setCheckingOut(null);
  }

  async function handleManageBilling() {
    setBillingLoading(true);
    const res = await fetch('/api/billing/portal', { method: 'POST' });
    if (res.ok) {
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
        return;
      }
    }
    setBillingLoading(false);
  }

  if (loading) return null;

  const currentPlan = profile?.plan || 'free';
  const currentTier = PRICING_TIERS.find((tier) => tier.plan === currentPlan);
  const limits = PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS];

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">{t('title')}</h1>

      {/* Profile */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('profile')}</CardTitle>
          <CardDescription>{t('profileDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName')}</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('fullNamePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('companyName')}</label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={t('companyPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
              <Input
                type="email"
                value={profile?.email || ''}
                disabled
                className="bg-gray-50 text-gray-500"
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? t('saving') : t('saveChanges')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Plan & Billing */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('planBilling')}</CardTitle>
          <CardDescription>{t('planBillingDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Current Plan */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{t('plan', { name: currentTier?.name || 'Free' })}</p>
                <Badge variant={currentPlan === 'free' ? 'secondary' : 'success'}>
                  {currentPlan === 'free' ? t('free') : t('active')}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {limits.testimonials === Infinity ? t('unlimited') : limits.testimonials} testimonials,{' '}
                {limits.forms === Infinity ? t('unlimited') : limits.forms} form{limits.forms !== 1 ? 's' : ''},{' '}
                {limits.widgets === Infinity ? t('unlimited') : limits.widgets} widget{limits.widgets !== 1 ? 's' : ''}
              </p>
              {profile?.testimonial_count !== undefined && (
                <>
                  <p className="text-xs text-gray-400 mt-1">
                    {t('using', {
                      used: profile.testimonial_count,
                      limit: limits.testimonials === Infinity ? t('unlimited') : limits.testimonials,
                    })}
                  </p>
                  {limits.testimonials !== Infinity && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={cn(
                          'h-2 rounded-full transition-all',
                          (profile.testimonial_count / limits.testimonials) > 0.8 ? 'bg-red-500' : 'bg-indigo-600'
                        )}
                        style={{ width: `${Math.min((profile.testimonial_count / limits.testimonials) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            {profile?.stripe_customer_id && currentPlan !== 'free' && (
              <Button variant="outline" onClick={handleManageBilling} disabled={billingLoading}>
                {billingLoading ? tc('loading') : t('manageBilling')}
              </Button>
            )}
          </div>

          {/* Upgrade Options */}
          {currentPlan !== 'business' && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                {currentPlan === 'free' ? t('upgradeYourPlan') : t('upgradeToBusiness')}
              </p>
              <div className="grid gap-4">
                {PRICING_TIERS.filter((tier) => {
                  if (currentPlan === 'free') return tier.plan !== 'free';
                  if (currentPlan === 'creator') return tier.plan === 'business';
                  return false;
                }).map((tier) => (
                  <div key={tier.plan} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-semibold">{tier.name}</p>
                      <p className="text-sm text-gray-500">{t('perMonth', { price: tier.price })}</p>
                      <ul className="mt-2 space-y-1">
                        {tier.features.slice(0, 3).map((f) => (
                          <li key={f} className="text-xs text-gray-500 flex items-center gap-1">
                            <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      onClick={() => handleCheckout(tier.plan as Plan)}
                      disabled={checkingOut === tier.plan}
                    >
                      {checkingOut === tier.plan ? tc('loading') : t('upgradeTo', { name: tier.name })}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">{t('dangerZone')}</CardTitle>
          <CardDescription>{t('dangerZoneDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">{t('deleteAccountWarning')}</p>
          <Button variant="destructive">{t('deleteAccount')}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
