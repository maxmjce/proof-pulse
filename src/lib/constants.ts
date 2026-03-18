import { PricingTier } from '@/types';

export const APP_NAME = 'ProofPulse';
export const APP_DESCRIPTION = 'Collect, manage, and showcase customer testimonials with beautiful embeddable widgets.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Free',
    plan: 'free',
    price: 0,
    testimonials: 10,
    forms: 1,
    widgets: 1,
    features: [
      'Up to 10 testimonials',
      '1 collection form',
      '1 embeddable widget',
      'ProofPulse branding',
      'Basic analytics',
    ],
  },
  {
    name: 'Creator',
    plan: 'creator',
    price: 199,
    testimonials: 100,
    forms: 5,
    widgets: 5,
    features: [
      'Up to 100 testimonials',
      '5 collection forms',
      '5 embeddable widgets',
      'Custom branding',
      'Video testimonials',
      'Email campaigns',
      'Priority support',
    ],
  },
  {
    name: 'Business',
    plan: 'business',
    price: 499,
    testimonials: null,
    forms: null,
    widgets: null,
    features: [
      'Unlimited testimonials',
      'Unlimited forms',
      'Unlimited widgets',
      'White-label (no branding)',
      'Video testimonials',
      'Email campaigns',
      'API access',
      'Priority support',
    ],
  },
];

export const PLAN_LIMITS = {
  free: { testimonials: 10, forms: 1, widgets: 1 },
  creator: { testimonials: 100, forms: 5, widgets: 5 },
  business: { testimonials: Infinity, forms: Infinity, widgets: Infinity },
} as const;

export const DEFAULT_WIDGET_CONFIG = {
  primary_color: '#6366f1',
  background_color: '#ffffff',
  text_color: '#1f2937',
  border_radius: 12,
  show_rating: true,
  show_avatar: true,
  show_date: true,
  animation: 'fade' as const,
  columns: 3,
  max_testimonials: 9,
};
