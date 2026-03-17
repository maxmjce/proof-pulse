'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { WidgetConfig } from '@/types';

interface EmbedTestimonial {
  id: string;
  author_name: string;
  author_title: string | null;
  author_avatar_url: string | null;
  content: string;
  rating: number | null;
  created_at: string;
}

interface EmbedData {
  widget: {
    id: string;
    type: string;
    config: WidgetConfig;
    show_branding: boolean;
  };
  testimonials: EmbedTestimonial[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill={star <= rating ? '#FBBF24' : '#E5E7EB'}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function EmbedPage() {
  const params = useParams();
  const [data, setData] = useState<EmbedData | null>(null);

  useEffect(() => {
    async function fetchWidget() {
      const res = await fetch(`/api/widget/${params.id}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    }
    fetchWidget();
  }, [params.id]);

  if (!data) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#9CA3AF' }}>Loading...</div>;
  }

  const { widget, testimonials } = data;
  const config = widget.config;

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '16px',
      backgroundColor: config.background_color,
      color: config.text_color,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(config.columns, testimonials.length)}, 1fr)`,
        gap: '16px',
      }}>
        {testimonials.map((t) => (
          <div
            key={t.id}
            style={{
              padding: '20px',
              borderRadius: `${config.border_radius}px`,
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
            }}
          >
            {config.show_rating && t.rating && <StarRating rating={t.rating} />}
            <p style={{ margin: '12px 0', fontSize: '14px', lineHeight: '1.5' }}>
              &ldquo;{t.content}&rdquo;
            </p>
            <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '12px' }}>
              <p style={{ fontWeight: 600, fontSize: '13px' }}>{t.author_name}</p>
              {t.author_title && (
                <p style={{ fontSize: '12px', color: '#6B7280' }}>{t.author_title}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {widget.show_branding && (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <a
            href="https://proofpulse.dev"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '11px', color: '#9CA3AF', textDecoration: 'none' }}
          >
            Powered by ProofPulse
          </a>
        </div>
      )}
    </div>
  );
}
