import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { DEFAULT_WIDGET_CONFIG } from '@/lib/constants';
import { checkWidgetLimit, getUserPlan } from '@/lib/plan-limits';

const createWidgetSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['carousel', 'wall', 'badge', 'minimal']).optional(),
  config: z.object({
    primary_color: z.string().optional(),
    background_color: z.string().optional(),
    text_color: z.string().optional(),
    border_radius: z.number().optional(),
    show_rating: z.boolean().optional(),
    show_avatar: z.boolean().optional(),
    show_date: z.boolean().optional(),
    animation: z.enum(['fade', 'slide', 'none']).optional(),
    columns: z.number().min(1).max(6).optional(),
    max_testimonials: z.number().min(1).max(50).optional(),
  }).optional(),
  testimonial_ids: z.array(z.string().uuid()).nullable().optional(),
  filter_tags: z.array(z.string()).nullable().optional(),
  show_branding: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check plan limits
    const plan = await getUserPlan(supabase, user.id);
    const limitCheck = await checkWidgetLimit(supabase, user.id, plan);
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: `Widget limit reached (${limitCheck.current}/${limitCheck.limit}). Upgrade your plan for more.`,
      }, { status: 403 });
    }

    const body = await request.json();
    const validated = createWidgetSchema.parse(body);

    const config = { ...DEFAULT_WIDGET_CONFIG, ...validated.config };

    const { data, error } = await supabase
      .from('widgets')
      .insert({
        user_id: user.id,
        name: validated.name,
        type: validated.type || 'carousel',
        config,
        testimonial_ids: validated.testimonial_ids || null,
        filter_tags: validated.filter_tags || null,
        show_branding: validated.show_branding ?? true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('widgets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
