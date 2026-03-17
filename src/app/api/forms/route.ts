import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { generateSlug } from '@/lib/utils';
import { checkFormLimit, getUserPlan } from '@/lib/plan-limits';

const createFormSchema = z.object({
  name: z.string().min(1).max(100),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  questions: z.array(z.object({
    id: z.string(),
    label: z.string(),
    type: z.enum(['text', 'textarea', 'rating']),
    required: z.boolean(),
  })).optional(),
  thank_you_message: z.string().max(500).optional(),
  collect_video: z.boolean().optional(),
  collect_rating: z.boolean().optional(),
  branding: z.object({
    primary_color: z.string(),
    background_color: z.string(),
    logo_url: z.string().nullable(),
  }).optional(),
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
    const limitCheck = await checkFormLimit(supabase, user.id, plan);
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: `Form limit reached (${limitCheck.current}/${limitCheck.limit}). Upgrade your plan for more.`,
      }, { status: 403 });
    }

    const body = await request.json();
    const validated = createFormSchema.parse(body);

    const slug = generateSlug(validated.name) + '-' + Date.now().toString(36);

    const { data, error } = await supabase
      .from('forms')
      .insert({
        user_id: user.id,
        name: validated.name,
        slug,
        title: validated.title || 'Share Your Experience',
        description: validated.description || null,
        questions: validated.questions || [],
        thank_you_message: validated.thank_you_message || 'Thank you for your testimonial!',
        collect_video: validated.collect_video ?? false,
        collect_rating: validated.collect_rating ?? true,
        branding: validated.branding || null,
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
      .from('forms')
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
