import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, locale: string = 'sv-SE'): string {
  return new Intl.DateTimeFormat(locale === 'sv' ? 'sv-SE' : locale === 'en' ? 'en-US' : locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return '';
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

export function getEmbedCode(widgetId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://proofpulse.dev';
  return `<script src="${baseUrl}/api/widget/${widgetId}/embed.js" async></script>
<div id="proofpulse-widget-${widgetId}"></div>`;
}
