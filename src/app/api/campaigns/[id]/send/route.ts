import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resend } from '@/lib/resend/client';
import { APP_URL } from '@/lib/constants';

export async function POST(
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

    // Fetch campaign with form details
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*, forms(name, slug)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaign.status === 'sent') {
      return NextResponse.json({ error: 'Campaign already sent' }, { status: 400 });
    }

    const form = campaign.forms as { name: string; slug: string } | null;
    const collectUrl = form ? `${APP_URL}/collect/${form.slug}` : `${APP_URL}`;

    // Send emails via Resend
    const results = await Promise.allSettled(
      campaign.recipient_emails.map((email: string) =>
        resend.emails.send({
          from: 'ProofPulse <noreply@proofpulse.dev>',
          to: email,
          subject: campaign.subject,
          html: buildEmailHtml(campaign.body, collectUrl),
        })
      )
    );

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    // Update campaign status
    await supabase
      .from('campaigns')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', id);

    return NextResponse.json({ sent, failed, total: campaign.recipient_emails.length });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function buildEmailHtml(body: string, collectUrl: string): string {
  const bodyHtml = body.replace(/\n/g, '<br>');
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="padding: 32px; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb;">
    ${bodyHtml}
    <div style="margin-top: 24px;">
      <a href="${collectUrl}" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 500;">
        Share Your Testimonial
      </a>
    </div>
  </div>
  <div style="text-align: center; margin-top: 16px; font-size: 12px; color: #9ca3af;">
    Sent via ProofPulse
  </div>
</body>
</html>`;
}
