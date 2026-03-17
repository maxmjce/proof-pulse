import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://proofpulse.dev';

  const script = `
(function() {
  var container = document.getElementById('proofpulse-widget-${id}');
  if (!container) {
    container = document.currentScript.parentElement;
    if (!container) return;
    var div = document.createElement('div');
    div.id = 'proofpulse-widget-${id}';
    container.appendChild(div);
    container = div;
  }
  var iframe = document.createElement('iframe');
  iframe.src = '${baseUrl}/embed/${id}';
  iframe.style.width = '100%';
  iframe.style.border = 'none';
  iframe.style.minHeight = '200px';
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('title', 'ProofPulse Testimonials');
  container.appendChild(iframe);

  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'proofpulse-resize' && event.data.widgetId === '${id}') {
      iframe.style.height = event.data.height + 'px';
    }
  });
})();
`.trim();

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'application/javascript',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
