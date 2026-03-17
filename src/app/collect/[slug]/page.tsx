'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const [form, setForm] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

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
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
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
            <h2 className="text-2xl font-bold mb-2">Form Not Found</h2>
            <p className="text-gray-600">This testimonial collection form doesn&apos;t exist or is no longer active.</p>
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
            <h2 className="text-2xl font-bold mb-2">Thank you!</h2>
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
                  How would you rate your experience?
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1"
                    >
                      <svg
                        className="w-8 h-8 transition-colors"
                        fill={star <= (hoveredRating || rating) ? '#FBBF24' : '#E5E7EB'}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name *
              </label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Your Role / Company
              </label>
              <Input id="title" name="title" placeholder="CEO at Acme Inc." />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Your Testimonial *
              </label>
              <Textarea
                id="content"
                name="content"
                placeholder="Tell us about your experience..."
                rows={5}
                required
              />
            </div>

            {form.collect_video && (
              <div>
                <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Video Testimonial URL
                </label>
                <Input
                  id="video_url"
                  name="video_url"
                  type="url"
                  placeholder="https://youtube.com/watch?v=... or https://loom.com/share/..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  Paste a link to your video testimonial (YouTube, Loom, Vimeo, etc.)
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
              {submitting ? 'Submitting...' : 'Submit Testimonial'}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-400">
            Powered by ProofPulse
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
