import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { checkTestimonialLimit, getUserPlan } from '@/lib/plan-limits';

const createTestimonialSchema = z.object({
  form_id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  author_name: z.string().min(1).max(100),
  author_email: z.string().email().optional().or(z.literal('')),
  author_title: z.string().max(100).optional().or(z.literal('')),
  content: z.string().min(1).max(2000),
  rating: z.number().min(1).max(5).optional(),
  video_url: z.string().url().optional().or(z.literal('')),
});

// POST - Submit a new testimonial (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createTestimonialSchema.parse(body);

    const supabase = await createClient();

    // If form_id is provided, look up the form to get the owner user_id
    let userId = validated.user_id;
    if (validated.form_id && !userId) {
      const { data: form } = await supabase
        .from('forms')
        .select('user_id')
        .eq('id', validated.form_id)
        .single();
      if (form) {
        userId = form.user_id;
      }
    }

    // If still no user_id, try current authenticated user
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Could not determine testimonial owner' }, { status: 400 });
    }

    // Check plan limits
    const plan = await getUserPlan(supabase, userId);
    const limitCheck = await checkTestimonialLimit(supabase, userId, plan);
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: `Testimonial limit reached (${limitCheck.current}/${limitCheck.limit}). Upgrade your plan for more.`,
      }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        form_id: validated.form_id || null,
        user_id: userId,
        author_name: validated.author_name,
        author_email: validated.author_email || null,
        author_title: validated.author_title || null,
        content: validated.content,
        rating: validated.rating || null,
        video_url: validated.video_url || null,
        status: 'pending',
        source: 'form',
        tags: [],
        is_featured: false,
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

// GET - List testimonials (authenticated)
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('testimonials')
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
