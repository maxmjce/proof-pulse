'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/ui/star-rating';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/hooks/use-toast';
import { useConfirm } from '@/hooks/use-confirm';
import { useDebounce } from '@/hooks/use-debounce';
import { Search, MessageSquarePlus, FileText } from 'lucide-react';
import type { Testimonial, Form } from '@/types';
import { formatDate } from '@/lib/utils';

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
    onUpdate(tags.filter((item) => item !== tag));
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
  const { toast } = useToast();
  const { confirm, confirmDialogProps } = useConfirm();

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
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

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
      toast({
        title: status === 'approved' ? t('testimonialApproved') : t('testimonialRejected'),
        variant: 'success',
      });
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
    const ok = await confirm({
      title: t('deleteConfirm'),
      description: t('deleteConfirm'),
      confirmLabel: tc('delete'),
      cancelLabel: tc('cancel'),
      variant: 'destructive',
    });
    if (!ok) return;
    const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setTestimonials((prev) => prev.filter((item) => item.id !== id));
      toast({ title: t('testimonialDeleted'), variant: 'success' });
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
      toast({ title: t('formCreated'), variant: 'success' });
    } else {
      const json = await res.json();
      setFormError(typeof json.error === 'string' ? json.error : 'Failed to create form.');
    }
    setCreating(false);
  }

  async function handleDeleteForm(id: string) {
    const ok = await confirm({
      title: t('deleteFormConfirm'),
      description: t('deleteFormConfirm'),
      confirmLabel: tc('delete'),
      cancelLabel: tc('cancel'),
      variant: 'destructive',
    });
    if (!ok) return;
    const res = await fetch(`/api/forms/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setForms((prev) => prev.filter((f) => f.id !== id));
      toast({ title: t('formDeleted'), variant: 'success' });
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

  const statusFiltered = filter === 'all'
    ? testimonials
    : testimonials.filter((item) => item.status === filter);

  const searchFiltered = debouncedSearch
    ? statusFiltered.filter((item) =>
        [item.author_name, item.author_title, item.content, ...(item.tags || [])].some(
          (field) => field?.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      )
    : statusFiltered;

  const totalPages = Math.ceil(searchFiltered.length / pageSize);
  const paginatedItems = searchFiltered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) return null;

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
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder={t('searchPlaceholder')}
              className="pl-10"
            />
          </div>

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
          {searchFiltered.length === 0 ? (
            <EmptyState
              icon={MessageSquarePlus}
              title={testimonials.length === 0 ? t('noTestimonials') : t('noMatching')}
              description={testimonials.length === 0 ? t('noTestimonialsDesc') : t('noMatchingDesc')}
              action={testimonials.length === 0 ? {
                label: t('createFirstForm'),
                onClick: () => { setTab('forms'); setShowFormCreator(true); },
              } : undefined}
            />
          ) : (
            <>
              <div className="space-y-4">
                {paginatedItems.map((testimonial) => (
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
                      {testimonial.rating && <StarRating rating={testimonial.rating} size="sm" />}
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
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={searchFiltered.length}
                pageSize={pageSize}
              />
            </>
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
            <EmptyState
              icon={FileText}
              title={t('noForms')}
              description={t('noFormsDesc')}
              action={{ label: t('createFirstForm'), onClick: () => setShowFormCreator(true) }}
            />
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

      <ConfirmDialog {...confirmDialogProps} />
    </div>
  );
}
