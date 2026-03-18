'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/hooks/use-toast';
import { useConfirm } from '@/hooks/use-confirm';
import { Mail } from 'lucide-react';
import type { Campaign, Form } from '@/types';
import { formatDate } from '@/lib/utils';

const statusBadgeVariant = {
  draft: 'secondary' as const,
  scheduled: 'warning' as const,
  sent: 'success' as const,
};

export default function CampaignsPage() {
  const t = useTranslations('campaigns');
  const tc = useTranslations('common');
  const locale = useLocale();
  const { toast } = useToast();
  const { confirm, confirmDialogProps } = useConfirm();

  const [campaigns, setCampaigns] = useState<(Campaign & { forms?: { name: string; slug: string } | null })[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);
  const [sending, setSending] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [formId, setFormId] = useState('');
  const [subject, setSubject] = useState('');
  // Default body is intentionally kept in English — this is email content sent to customers,
  // not UI text, so it should not vary with the dashboard locale.
  const [body, setBody] = useState('We\'d love to hear about your experience! Please take a moment to share your feedback.');
  const [emails, setEmails] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const fetchCampaigns = useCallback(async () => {
    const res = await fetch('/api/campaigns');
    if (res.ok) {
      const json = await res.json();
      setCampaigns(json.data || []);
    }
  }, []);

  const fetchForms = useCallback(async () => {
    const res = await fetch('/api/forms');
    if (res.ok) {
      const json = await res.json();
      setForms(json.data || []);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchCampaigns(), fetchForms()]).then(() => setLoading(false));
  }, [fetchCampaigns, fetchForms]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'create') setShowCreator(true);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError('');

    const emailList = emails
      .split(/[,\n]/)
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    if (emailList.length === 0) {
      setError(t('atLeastOneEmail'));
      setCreating(false);
      return;
    }

    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        form_id: formId,
        subject,
        body,
        recipient_emails: emailList,
      }),
    });

    if (res.ok) {
      setName('');
      setSubject('');
      // Reset to the same English default — see comment above on body state.
      setBody('We\'d love to hear about your experience! Please take a moment to share your feedback.');
      setEmails('');
      setShowCreator(false);
      fetchCampaigns();
      toast({ title: t('campaignCreated'), variant: 'success' });
    } else {
      const json = await res.json();
      setError(typeof json.error === 'string' ? json.error : 'Failed to create campaign.');
    }
    setCreating(false);
  }

  async function handleSend(campaignId: string) {
    const ok = await confirm({
      title: t('sendConfirm'),
      description: t('sendConfirm'),
      confirmLabel: t('sendNow'),
      cancelLabel: tc('cancel'),
    });
    if (!ok) return;
    setSending(campaignId);
    const res = await fetch(`/api/campaigns/${campaignId}/send`, { method: 'POST' });
    const json = await res.json();
    if (res.ok) {
      fetchCampaigns();
      if (json.failed > 0) {
        toast({ title: t('sendPartial', { sent: json.sent, total: json.total, failed: json.failed }), variant: 'warning' });
      } else {
        toast({ title: t('sendSuccess', { sent: json.sent }), variant: 'success' });
      }
    } else {
      toast({ title: t('sendFailed', { error: json.error || 'Unknown error' }), variant: 'error' });
    }
    setSending(null);
  }

  async function handleDelete(id: string) {
    const ok = await confirm({
      title: t('deleteConfirm'),
      description: t('deleteConfirm'),
      confirmLabel: tc('delete'),
      cancelLabel: tc('cancel'),
      variant: 'destructive',
    });
    if (!ok) return;
    const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      toast({ title: t('campaignDeleted'), variant: 'success' });
    }
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-gray-500">{t('subtitle')}</p>
        </div>
        <Button onClick={() => setShowCreator(true)}>{t('createCampaign')}</Button>
      </div>

      {/* Campaign Creator */}
      {showCreator && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('createCampaign')}</CardTitle>
            <CardDescription>{t('subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            {forms.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">{t('needFormFirst')}</p>
                <Button asChild variant="outline">
                  <a href="/testimonials?tab=forms&action=create">{t('createFormLink')}</a>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('campaignName')} *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('campaignNamePlaceholder')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('collectionForm')} *</label>
                  <select
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">{t('selectForm')}</option>
                    {forms.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('emailSubject')} *</label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t('emailSubjectPlaceholder')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('emailBody')} *</label>
                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={5}
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">{t('emailBodyHint')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('recipientEmails')} *</label>
                  <Textarea
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    placeholder={t('recipientEmailsPlaceholder')}
                    rows={4}
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">{t('recipientEmailsHint')}</p>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex gap-2">
                  <Button type="submit" disabled={creating}>
                    {creating ? t('creating') : t('createDraft')}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreator(false)}>
                    {tc('cancel')}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* Campaign List */}
      {campaigns.length === 0 && !showCreator ? (
        <EmptyState
          icon={Mail}
          title={t('noCampaigns')}
          description={t('noCampaignsDesc')}
          action={{ label: t('createFirstCampaign'), onClick: () => setShowCreator(true) }}
        />
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{campaign.name}</CardTitle>
                    <CardDescription>
                      {t('recipients', { count: campaign.recipient_emails.length })}
                      {campaign.forms && <> &middot; {t('form', { name: campaign.forms.name })}</>}
                    </CardDescription>
                  </div>
                  <Badge variant={statusBadgeVariant[campaign.status]}>
                    {campaign.status === 'draft'
                      ? t('draft')
                      : campaign.status === 'scheduled'
                        ? t('scheduled')
                        : t('sentStatus')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">{t('subject')}:</span> {campaign.subject}
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  {t('created', { date: formatDate(campaign.created_at, locale) })}
                  {campaign.sent_at && <> &middot; {t('sent', { date: formatDate(campaign.sent_at, locale) })}</>}
                </p>
                <div className="flex gap-2">
                  {campaign.status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={() => handleSend(campaign.id)}
                      disabled={sending === campaign.id}
                    >
                      {sending === campaign.id ? t('sending') : t('sendNow')}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(campaign.id)}
                  >
                    {tc('delete')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog {...confirmDialogProps} />
    </div>
  );
}
