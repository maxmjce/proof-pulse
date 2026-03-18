'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';

interface FormConfig {
  id: string;
  user_id: string;
  name: string;
  title: string;
  description: string | null;
  thank_you_message: string;
  collect_rating: boolean;
  collect_video: boolean;
  branding: {
    primary_color: string;
    background_color: string;
    logo_url: string | null;
  } | null;
  is_active: boolean;
}

export default function CollectPage() {
  const params = useParams();
  const t = useTranslations('collect');
  const tc = useTranslations('common');
  const [form, setForm] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    async function fetchForm() {
      const res = await fetch(`/api/forms/by-slug/${params.slug}`);
      if (res.ok) {
        const json = await res.json();
        setForm(json.data);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }
    fetchForm();
  }, [params.slug]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      form_id: form?.id,
      user_id: form?.user_id,
      author_name: formData.get('name'),
      author_email: formData.get('email'),
      author_title: formData.get('title'),
      content: formData.get('content'),
      rating: rating || undefined,
      video_url: formData.get('video_url') || undefined,
    };

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(t('submitError'));
      }
    } catch {
      setError(t('submitError'));
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (notFound || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-lg text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-2">{t('formNotFound')}</h2>
            <p className="text-gray-600">{t('formNotFoundDesc')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: form.branding?.background_color || '#f9fafb' }}
      >
        <Card className="w-full max-w-lg text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">{t('thankYou')}</h2>
            <p className="text-gray-600">{form.thank_you_message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const primaryColor = form.branding?.primary_color || '#6366f1';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: form.branding?.background_color || '#f9fafb' }}
    >
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center">{form.title}</CardTitle>
          {form.description && (
            <p className="text-center text-gray-500 text-sm mt-1">{form.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating */}
            {form.collect_rating && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('ratingLabel')}
                </label>
                <StarRating
                  rating={rating}
                  size="lg"
                  interactive
                  onRatingChange={setRating}
                />
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('yourName')} {t('required')}
              </label>
              <Input id="name" name="name" placeholder={t('yourNamePlaceholder')} required />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('emailLabel')}
              </label>
              <Input id="email" name="email" type="email" placeholder={t('emailPlaceholder')} />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                {t('roleCompany')}
              </label>
              <Input id="title" name="title" placeholder={t('roleCompanyPlaceholder')} />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                {t('yourTestimonial')} {t('required')}
              </label>
              <Textarea
                id="content"
                name="content"
                placeholder={t('testimonialPlaceholder')}
                rows={5}
                required
              />
            </div>

            {form.collect_video && (
              <div>
                <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('videoUrl')}
                </label>
                <Input
                  id="video_url"
                  name="video_url"
                  type="url"
                  placeholder={t('videoUrlPlaceholder')}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {t('videoUrlHint')}
                </p>
              </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              className="w-full"
              disabled={submitting}
              style={{ backgroundColor: primaryColor }}
            >
              {submitting ? t('submitting') : t('submitTestimonial')}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-400">
            {tc('poweredBy')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
