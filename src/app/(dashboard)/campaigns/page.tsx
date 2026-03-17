'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { Campaign, Form } from '@/types';
import { formatDate } from '@/lib/utils';

const statusBadgeVariant = {
  draft: 'secondary' as const,
  scheduled: 'warning' as const,
  sent: 'success' as const,
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<(Campaign & { forms?: { name: string; slug: string } | null })[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);
  const [sending, setSending] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [formId, setFormId] = useState('');
  const [subject, setSubject] = useState('');
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
      setError('Please add at least one recipient email.');
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
      setBody('We\'d love to hear about your experience! Please take a moment to share your feedback.');
      setEmails('');
      setShowCreator(false);
      fetchCampaigns();
    } else {
      const json = await res.json();
      setError(typeof json.error === 'string' ? json.error : 'Failed to create campaign.');
    }
    setCreating(false);
  }

  async function handleSend(campaignId: string) {
    if (!window.confirm('Send this campaign now? Emails will be sent to all recipients immediately.')) return;
    setSending(campaignId);
    const res = await fetch(`/api/campaigns/${campaignId}/send`, { method: 'POST' });
    if (res.ok) {
      fetchCampaigns();
    }
    setSending(null);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this campaign? This cannot be undone.')) return;
    const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Email Campaigns</h1>
          <p className="text-gray-500">Request testimonials via automated emails</p>
        </div>
        <Button onClick={() => setShowCreator(true)}>Create Campaign</Button>
      </div>

      {/* Campaign Creator */}
      {showCreator && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create Campaign</CardTitle>
            <CardDescription>Send emails requesting testimonials from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            {forms.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">
                  You need to create a collection form first before you can send a campaign.
                </p>
                <Button asChild variant="outline">
                  <a href="/testimonials?tab=forms&action=create">Create a Form</a>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Post-Purchase Follow-up"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Collection Form *</label>
                  <select
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select a form...</option>
                    {forms.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject *</label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., We'd love your feedback!"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Body *</label>
                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={5}
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    A &quot;Share Your Testimonial&quot; button will be added automatically.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Emails *</label>
                  <Textarea
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    placeholder="one@example.com, two@example.com&#10;Or one email per line"
                    rows={4}
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Separate emails with commas or new lines.
                  </p>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex gap-2">
                  <Button type="submit" disabled={creating}>
                    {creating ? 'Creating...' : 'Create Draft'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreator(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* Campaign List */}
      {campaigns.length === 0 && !showCreator ? (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
            <p className="text-gray-500 mb-4">
              Create an email campaign to automatically request testimonials from your customers.
            </p>
            <Button onClick={() => setShowCreator(true)}>Create Your First Campaign</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{campaign.name}</CardTitle>
                    <CardDescription>
                      {campaign.recipient_emails.length} recipient{campaign.recipient_emails.length !== 1 ? 's' : ''}
                      {campaign.forms && <> &middot; Form: {campaign.forms.name}</>}
                    </CardDescription>
                  </div>
                  <Badge variant={statusBadgeVariant[campaign.status]}>
                    {campaign.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Subject:</span> {campaign.subject}
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  Created {formatDate(campaign.created_at)}
                  {campaign.sent_at && <> &middot; Sent {formatDate(campaign.sent_at)}</>}
                </p>
                <div className="flex gap-2">
                  {campaign.status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={() => handleSend(campaign.id)}
                      disabled={sending === campaign.id}
                    >
                      {sending === campaign.id ? 'Sending...' : 'Send Now'}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(campaign.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
