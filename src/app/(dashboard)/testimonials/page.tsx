'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Testimonial } from '@/types';

// TODO: Fetch from Supabase
const MOCK_TESTIMONIALS: Testimonial[] = [];

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

export default function TestimonialsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const testimonials = MOCK_TESTIMONIALS;

  const filtered = filter === 'all'
    ? testimonials
    : testimonials.filter((t) => t.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="text-gray-500">{testimonials.length} total testimonials</p>
        </div>
        <Button>Create Collection Form</Button>
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
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* Testimonial List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No testimonials yet</h3>
            <p className="text-gray-500 mb-4">
              Create a collection form and share the link with your customers to start collecting testimonials.
            </p>
            <Button>Create Your First Form</Button>
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
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusBadgeVariant[testimonial.status]}>
                      {testimonial.status}
                    </Badge>
                    {testimonial.is_featured && (
                      <Badge>Featured</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <StarDisplay rating={testimonial.rating} />
                <p className="mt-2 text-gray-700">{testimonial.content}</p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline">Approve</Button>
                  <Button size="sm" variant="outline">Reject</Button>
                  <Button size="sm" variant="ghost">Feature</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
