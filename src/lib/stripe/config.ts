import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-02-25.clover',
      typescript: true,
    });
  }
  return _stripe;
}

// These will be set after creating products in Stripe Dashboard
export const STRIPE_PRICES = {
  creator_monthly: process.env.STRIPE_PRICE_CREATOR_MONTHLY || '',
  creator_yearly: process.env.STRIPE_PRICE_CREATOR_YEARLY || '',
  business_monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || '',
  business_yearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY || '',
};
