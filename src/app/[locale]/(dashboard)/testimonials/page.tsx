'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Testimonial, Form } from '@/types';
import { formatDate } from '@/lib/utils';

function StarDisplay({ rating }: { rating: number | null }) {
  if (!rating) return null;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const statusBadgeVariant = {
  pending: 'warning' as const,
  approved: 'success' as const,
  rejected: 'destructive' as const,
};

function TagInput({
  tags,
  onUpdate,
  addTagPlaceholder,
}: {
  tags: string[];
  onUpdate: (tags: string[]) => void;
  addTagPlaceholder: string;
}) {
  const [input, setInput] = useState('');

  function handleAdd(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      const newTag = input.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        onUpdate([...tags, newTag]);
      }
      setInput('');
    }
  }

  function handleRemove(tag: string) {
    onUpdate(tags.filter((t) => t !== tag));
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      {tags.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
          {tag}
          <button
            type="button"
            onClick={() => handleRemove(tag)}
            className="hover:text-indigo-900"
            aria-label={`Remove tag ${tag}`}
          >
            &times;
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleAdd}
        placeholder={addTagPlaceholder}
        className="text-xs border-none outline-none bg-transparent w-20 placeholder:text-gray-400"
      />
    </div>
  );
}

export default function TestimonialsPage() {
  const t = useTranslations('testimonials');
  const tc = useTranslations('common');

  const [tab, setTab] = useState<'testimonials' | 'forms'>('testimonials');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormCreator, setShowFormCreator] = useState(false);
  const [formName, setFormName] = useState('');
  const [formTitle, setFormTitle] = useState('Share Your Experience');
  const [formDescription, setFormDescription] = useState('');
  const [formThankYou, setFormThankYou] = useState('Thank you for your testimonial!');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchTestimonials = useCallback(async () => {
    const res = await fetch('/api/testimonials');
    if (res.ok) {
      const json = await res.json();
      setTestimonials(json.data || []);
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
    Promise.all([fetchTestimonials(), fetchForms()]).then(() => setLoading(false));
  }, [fetchTestimonials, fetchForms]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'forms') setTab('forms');
    if (params.get('action') === 'create') {
      setTab('forms');
      setShowFormCreator(true);
    }
  }, []);

  async function handleStatusChange(id: string, status: 'approved' | 'rejected') {
    const res = await fetch(`/api/testimonials/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setTestimonials((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
    }
  }

  async function handleToggleFeatured(id: string, isFeatured: boolean) {
    const res = await fetch(`/api/testimonials/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_featured: !isFeatured }),
    });
    if (res.ok) {
      setTestimonials((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_featured: !isFeatured } : item))
      );
    }
  }

  async function handleUpdateTags(id: string, tags: string[]) {
    const res = await fetch(`/api/testimonials/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags }),
    });
    if (res.ok) {
      setTestimonials((prev) =>
        prev.map((item) => (item.id === id ? { ...item, tags } : item))
      );
    }
  }

  async function handleDeleteTestimonial(id: string) {
    if (!window.confirm(t('deleteConfirm'))) return;
    const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setTestimonials((prev) => prev.filter((item) => item.id !== id));
    }
  }

  async function handleCreateForm(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setFormError('');
    const res = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formName,
        title: formTitle,
        description: formDescription || undefined,
        thank_you_message: formThankYou,
      }),
    });
    if (res.ok) {
      setFormName('');
      setFormTitle('Share Your Experience');
      setFormDescription('');
      setFormThankYou('Thank you for your testimonial!');
      setShowFormCreator(false);
      fetchForms();
    } else {
      const json = await res.json();
      setFormError(typeof json.error === 'string' ? json.error : 'Failed to create form.');
    }
    setCreating(false);
  }

  async function handleDeleteForm(id: string) {
    if (!window.confirm(t('deleteFormConfirm'))) return;
    const res = await fetch(`/api/forms/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setForms((prev) => prev.filter((f) => f.id !== id));
    }
  }

  async function handleToggleFormActive(id: string, isActive: boolean) {
    const res = await fetch(`/api/forms/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !isActive }),
    });
    if (res.ok) {
      setForms((prev) =>
        prev.map((f) => (f.id === id ? { ...f, is_active: !isActive } : f))
      );
    }
  }

  const filtered = filter === 'all'
    ? testimonials
    : testimonials.filter((item) => item.status === filter);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-gray-500">{t('totalCount', { count: testimonials.length })}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        <button
          onClick={() => setTab('testimonials')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === 'testimonials'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('tab', { count: testimonials.length })}
        </button>
        <button
          onClick={() => setTab('forms')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === 'forms'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('formsTab', { count: forms.length })}
        </button>
      </div>

      {tab === 'testimonials' && (
        <>
          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {t(f)}
                {f !== 'all' && (
                  <span className="ml-1 text-xs opacity-70">
                    ({testimonials.filter((item) => item.status === f).length})
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Testimonial List */}
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-lg font-semibold mb-2">
                  {testimonials.length === 0 ? t('noTestimonials') : t('noMatching')}
                </h3>
                <p className="text-gray-500 mb-4">
                  {testimonials.length === 0
                    ? t('noTestimonialsDesc')
                    : t('noMatchingDesc')}
                </p>
                {testimonials.length === 0 && (
                  <Button onClick={() => { setTab('forms'); setShowFormCreator(true); }}>
                    {t('createFirstForm')}
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filtered.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{testimonial.author_name}</CardTitle>
                        {testimonial.author_title && (
                          <p className="text-sm text-gray-500">{testimonial.author_title}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{formatDate(testimonial.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={statusBadgeVariant[testimonial.status]}>
                          {t(testimonial.status)}
                        </Badge>
                        {testimonial.is_featured && (
                          <Badge>{t('featured')}</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <StarDisplay rating={testimonial.rating} />
                    <p className="mt-2 text-gray-700">{testimonial.content}</p>

                    {/* Tags */}
                    <TagInput
                      tags={testimonial.tags || []}
                      onUpdate={(tags) => handleUpdateTags(testimonial.id, tags)}
                      addTagPlaceholder={t('addTag')}
                    />

                    <div className="mt-4 flex gap-2">
                      {testimonial.status !== 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(testimonial.id, 'approved')}
                        >
                          {t('approve')}
                        </Button>
                      )}
                      {testimonial.status !== 'rejected' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(testimonial.id, 'rejected')}
                        >
                          {t('reject')}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleFeatured(testimonial.id, testimonial.is_featured)}
                      >
                        {testimonial.is_featured ? t('unfeature') : t('feature')}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                      >
                        {tc('delete')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'forms' && (
        <>
          <div className="flex justify-end mb-6">
            <Button onClick={() => setShowFormCreator(true)}>{t('createForm')}</Button>
          </div>

          {/* Form Creator */}
          {showFormCreator && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t('createForm')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateForm} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('formName')} *
                    </label>
                    <Input
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder={t('formNamePlaceholder')}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('pageTitle')}
                    </label>
                    <Input
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder={t('pageTitlePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('description')}
                    </label>
                    <Textarea
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder={t('descriptionPlaceholder')}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('thankYouMessage')}
                    </label>
                    <Input
                      value={formThankYou}
                      onChange={(e) => setFormThankYou(e.target.value)}
                      placeholder={t('thankYouPlaceholder')}
                    />
                  </div>
                  {formError && <p className="text-sm text-red-600">{formError}</p>}
                  <div className="flex gap-2">
                    <Button type="submit" disabled={creating}>
                      {creating ? t('creatingForm') : t('createForm')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => { setShowFormCreator(false); setFormError(''); }}
                    >
                      {tc('cancel')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Forms List */}
          {forms.length === 0 && !showFormCreator ? (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-lg font-semibold mb-2">{t('noForms')}</h3>
                <p className="text-gray-500 mb-4">{t('noFormsDesc')}</p>
                <Button onClick={() => setShowFormCreator(true)}>{t('createFirstForm')}</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {forms.map((form) => (
                <Card key={form.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{form.name}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">{form.title}</p>
                      </div>
                      <Badge variant={form.is_active ? 'success' : 'secondary'}>
                        {form.is_active ? t('active') : t('inactive')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <span>{t('link')}:</span>
                      <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                        {window.location.origin}/collect/{form.slug}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigator.clipboard.writeText(`${window.location.origin}/collect/${form.slug}`)}
                      >
                        {tc('copy')}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleFormActive(form.id, form.is_active)}
                      >
                        {form.is_active ? t('deactivate') : t('activate')}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteForm(form.id)}
                      >
                        {tc('delete')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
