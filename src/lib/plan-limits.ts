import { PLAN_LIMITS } from '@/lib/constants';
import type { Plan } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';

interface LimitCheck {
  allowed: boolean;
  current: number;
  limit: number;
  resource: string;
}

export async function checkTestimonialLimit(
  supabase: SupabaseClient,
  userId: string,
  plan: Plan
): Promise<LimitCheck> {
  const limits = PLAN_LIMITS[plan];
  if (limits.testimonials === Infinity) {
    return { allowed: true, current: 0, limit: Infinity, resource: 'testimonials' };
  }

  const { count } = await supabase
    .from('testimonials')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const current = count ?? 0;
  return {
    allowed: current < limits.testimonials,
    current,
    limit: limits.testimonials,
    resource: 'testimonials',
  };
}

export async function checkFormLimit(
  supabase: SupabaseClient,
  userId: string,
  plan: Plan
): Promise<LimitCheck> {
  const limits = PLAN_LIMITS[plan];
  if (limits.forms === Infinity) {
    return { allowed: true, current: 0, limit: Infinity, resource: 'forms' };
  }

  const { count } = await supabase
    .from('forms')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const current = count ?? 0;
  return {
    allowed: current < limits.forms,
    current,
    limit: limits.forms,
    resource: 'forms',
  };
}

export async function checkWidgetLimit(
  supabase: SupabaseClient,
  userId: string,
  plan: Plan
): Promise<LimitCheck> {
  const limits = PLAN_LIMITS[plan];
  if (limits.widgets === Infinity) {
    return { allowed: true, current: 0, limit: Infinity, resource: 'widgets' };
  }

  const { count } = await supabase
    .from('widgets')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const current = count ?? 0;
  return {
    allowed: current < limits.widgets,
    current,
    limit: limits.widgets,
    resource: 'widgets',
  };
}

export async function getUserPlan(
  supabase: SupabaseClient,
  userId: string
): Promise<Plan> {
  const { data } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single();
  return (data?.plan as Plan) || 'free';
}
