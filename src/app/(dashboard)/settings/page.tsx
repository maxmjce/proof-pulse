'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Profile, Plan } from '@/types';
import { PRICING_TIERS, PLAN_LIMITS } from '@/lib/constants';

export default function SettingsPage() {
  const [profile, setProfile] = useState<(Profile & { email?: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
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
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
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

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  const currentPlan = profile?.plan || 'free';
  const currentTier = PRICING_TIERS.find((t) => t.plan === currentPlan);
  const limits = PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS];

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      {/* Profile */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your company"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input type="email" value={profile?.email || ''} disabled />
            </div>
            <Button type="submit" disabled={saving}>
              {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Plan & Billing */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Plan & Billing</CardTitle>
          <CardDescription>Manage your subscription</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Current Plan */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{currentTier?.name || 'Free'} Plan</p>
                <Badge variant={currentPlan === 'free' ? 'secondary' : 'success'}>
                  {currentPlan === 'free' ? 'Free' : 'Active'}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {limits.testimonials === Infinity ? 'Unlimited' : limits.testimonials} testimonials,{' '}
                {limits.forms === Infinity ? 'unlimited' : limits.forms} form{limits.forms !== 1 ? 's' : ''},{' '}
                {limits.widgets === Infinity ? 'unlimited' : limits.widgets} widget{limits.widgets !== 1 ? 's' : ''}
              </p>
              {profile?.testimonial_count !== undefined && (
                <p className="text-xs text-gray-400 mt-1">
                  Using {profile.testimonial_count} of {limits.testimonials === Infinity ? 'unlimited' : limits.testimonials} testimonials
                </p>
              )}
            </div>
            {profile?.stripe_customer_id && currentPlan !== 'free' && (
              <Button variant="outline" onClick={handleManageBilling} disabled={billingLoading}>
                {billingLoading ? 'Loading...' : 'Manage Billing'}
              </Button>
            )}
          </div>

          {/* Upgrade Options */}
          {currentPlan !== 'business' && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                {currentPlan === 'free' ? 'Upgrade your plan' : 'Upgrade to Business'}
              </p>
              <div className="grid gap-4">
                {PRICING_TIERS.filter((t) => {
                  if (currentPlan === 'free') return t.plan !== 'free';
                  if (currentPlan === 'creator') return t.plan === 'business';
                  return false;
                }).map((tier) => (
                  <div key={tier.plan} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-semibold">{tier.name}</p>
                      <p className="text-sm text-gray-500">${tier.price}/month</p>
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
                      {checkingOut === tier.plan ? 'Loading...' : `Upgrade to ${tier.name}`}
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
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Once you delete your account, there is no going back. All your data will be permanently removed.
          </p>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
