import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch widget data (public endpoint for embed)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch widget config
    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (widgetError || !widget) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }

    // Fetch approved testimonials for this widget
    let query = supabase
      .from('testimonials')
      .select('id, author_name, author_title, author_avatar_url, content, rating, created_at')
      .eq('user_id', widget.user_id)
      .eq('status', 'approved')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (widget.testimonial_ids && widget.testimonial_ids.length > 0) {
      query = query.in('id', widget.testimonial_ids);
    }

    if (widget.filter_tags && widget.filter_tags.length > 0) {
      query = query.overlaps('tags', widget.filter_tags);
    }

    const maxTestimonials = widget.config?.max_testimonials || 9;
    query = query.limit(maxTestimonials);

    const { data: testimonials, error: testimonialError } = await query;

    if (testimonialError) {
      return NextResponse.json({ error: testimonialError.message }, { status: 500 });
    }

    return NextResponse.json({
      widget: {
        id: widget.id,
        type: widget.type,
        config: widget.config,
        show_branding: widget.show_branding,
      },
      testimonials: testimonials || [],
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
