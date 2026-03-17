import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe/config';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      const plan = session.metadata?.plan;

      if (userId && plan) {
        await supabase
          .from('profiles')
          .update({
            plan,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq('id', userId);
      }
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Determine plan from price
      const priceId = subscription.items.data[0]?.price?.id;
      let plan = 'free';
      if (priceId) {
        const creatorMonthly = process.env.STRIPE_PRICE_CREATOR_MONTHLY;
        const creatorYearly = process.env.STRIPE_PRICE_CREATOR_YEARLY;
        const businessMonthly = process.env.STRIPE_PRICE_BUSINESS_MONTHLY;
        const businessYearly = process.env.STRIPE_PRICE_BUSINESS_YEARLY;

        if (priceId === creatorMonthly || priceId === creatorYearly) {
          plan = 'creator';
        } else if (priceId === businessMonthly || priceId === businessYearly) {
          plan = 'business';
        }
      }

      if (subscription.status === 'active') {
        await supabase
          .from('profiles')
          .update({
            plan,
            stripe_subscription_id: subscription.id,
          })
          .eq('stripe_customer_id', customerId);
      } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
        await supabase
          .from('profiles')
          .update({
            plan: 'free',
            stripe_subscription_id: null,
          })
          .eq('stripe_customer_id', customerId);
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await supabase
        .from('profiles')
        .update({
          plan: 'free',
          stripe_subscription_id: null,
        })
        .eq('stripe_customer_id', customerId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
