'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import type { WidgetConfig, WidgetType } from '@/types';

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
    type: WidgetType;
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

function Initials({ name }: { name: string }) {
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      background: '#E0E7FF', color: '#4338CA',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 600, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function TestimonialCard({
  testimonial, config,
}: {
  testimonial: EmbedTestimonial;
  config: WidgetConfig;
}) {
  return (
    <div style={{
      padding: '20px',
      borderRadius: `${config.border_radius}px`,
      border: '1px solid #E5E7EB',
      backgroundColor: '#FFFFFF',
    }}>
      {config.show_rating && testimonial.rating && <StarRating rating={testimonial.rating} />}
      <p style={{ margin: '12px 0', fontSize: '14px', lineHeight: '1.6', color: config.text_color }}>
        &ldquo;{testimonial.content}&rdquo;
      </p>
      <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {config.show_avatar && <Initials name={testimonial.author_name} />}
        <div>
          <p style={{ fontWeight: 600, fontSize: '13px', color: config.text_color }}>{testimonial.author_name}</p>
          {testimonial.author_title && (
            <p style={{ fontSize: '12px', color: '#6B7280' }}>{testimonial.author_title}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CarouselWidget({ testimonials, config }: { testimonials: EmbedTestimonial[]; config: WidgetConfig }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <div>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          transition: 'transform 0.5s ease',
          transform: `translateX(-${current * 100}%)`,
        }}>
          {testimonials.map((t) => (
            <div key={t.id} style={{ minWidth: '100%', padding: '0 4px', boxSizing: 'border-box' }}>
              <TestimonialCard testimonial={t} config={config} />
            </div>
          ))}
        </div>
      </div>
      {testimonials.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0,
                backgroundColor: i === current ? config.primary_color : '#D1D5DB',
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WallWidget({ testimonials, config }: { testimonials: EmbedTestimonial[]; config: WidgetConfig }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${Math.min(config.columns, testimonials.length || 1)}, 1fr)`,
      gap: '16px',
    }}>
      {testimonials.map((t) => (
        <TestimonialCard key={t.id} testimonial={t} config={config} />
      ))}
    </div>
  );
}

function BadgeWidget({ testimonials, config }: { testimonials: EmbedTestimonial[]; config: WidgetConfig }) {
  const totalReviews = testimonials.length;
  const avgRating = totalReviews > 0
    ? testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.filter((t) => t.rating).length
    : 0;

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '12px',
      padding: '12px 20px', borderRadius: `${config.border_radius}px`,
      border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="#FBBF24">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span style={{ fontWeight: 700, fontSize: '18px', color: config.text_color }}>
          {avgRating ? avgRating.toFixed(1) : '—'}
        </span>
      </div>
      <div style={{ height: '24px', width: '1px', backgroundColor: '#E5E7EB' }} />
      <span style={{ fontSize: '13px', color: '#6B7280' }}>
        {totalReviews} review{totalReviews !== 1 ? 's' : ''}
      </span>
    </div>
  );
}

function MinimalWidget({ testimonials, config }: { testimonials: EmbedTestimonial[]; config: WidgetConfig }) {
  const featured = testimonials[0];
  if (!featured) return null;

  return (
    <div style={{
      padding: '24px', borderRadius: `${config.border_radius}px`,
      border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
      maxWidth: '500px',
    }}>
      {config.show_rating && featured.rating && <StarRating rating={featured.rating} />}
      <p style={{
        margin: '16px 0', fontSize: '16px', lineHeight: '1.6',
        color: config.text_color, fontStyle: 'italic',
      }}>
        &ldquo;{featured.content}&rdquo;
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {config.show_avatar && <Initials name={featured.author_name} />}
        <div>
          <p style={{ fontWeight: 600, fontSize: '14px', color: config.text_color }}>{featured.author_name}</p>
          {featured.author_title && (
            <p style={{ fontSize: '12px', color: '#6B7280' }}>{featured.author_title}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EmbedPage() {
  const params = useParams();
  const [data, setData] = useState<EmbedData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sendResize = useCallback(() => {
    if (containerRef.current && data) {
      const height = containerRef.current.scrollHeight;
      window.parent.postMessage(
        { type: 'proofpulse-resize', widgetId: data.widget.id, height },
        '*'
      );
    }
  }, [data]);

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

  useEffect(() => {
    if (!data) return;
    // Send initial resize after render
    const timer = setTimeout(sendResize, 100);
    // Resize observer for dynamic content
    const observer = new ResizeObserver(sendResize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [data, sendResize]);

  if (!data) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#9CA3AF' }}>Loading...</div>;
  }

  const { widget, testimonials } = data;
  const config = widget.config;

  function renderWidget() {
    switch (widget.type) {
      case 'carousel':
        return <CarouselWidget testimonials={testimonials} config={config} />;
      case 'wall':
        return <WallWidget testimonials={testimonials} config={config} />;
      case 'badge':
        return <BadgeWidget testimonials={testimonials} config={config} />;
      case 'minimal':
        return <MinimalWidget testimonials={testimonials} config={config} />;
      default:
        return <WallWidget testimonials={testimonials} config={config} />;
    }
  }

  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '16px',
        backgroundColor: config.background_color,
        color: config.text_color,
      }}
    >
      {testimonials.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#9CA3AF', fontSize: '14px' }}>
          No testimonials to display yet.
        </div>
      ) : (
        renderWidget()
      )}
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
