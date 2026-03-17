import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateWidgetSchema = z.object({
  name: z.string().min(1).max(100).optional(),
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
  is_active: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = updateWidgetSchema.parse(body);

    // If config is partial, merge with existing
    if (validated.config) {
      const { data: existing } = await supabase
        .from('widgets')
        .select('config')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        validated.config = { ...existing.config, ...validated.config };
      }
    }

    const { data, error } = await supabase
      .from('widgets')
      .update(validated)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('widgets')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
