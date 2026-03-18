// Test all service connections
require('dotenv').config({ path: '.env.local' });

async function testSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const res = await fetch(`${url}/rest/v1/`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` },
  });

  if (res.ok) {
    const tables = await res.json();
    // Check if our tables exist
    console.log('  Supabase REST API: OK');
    return true;
  } else {
    console.log('  Supabase REST API: FAILED (' + res.status + ')');
    return false;
  }
}

async function testSupabaseTables() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const tables = ['profiles', 'forms', 'testimonials', 'widgets', 'campaigns'];

  for (const table of tables) {
    const res = await fetch(`${url}/rest/v1/${table}?select=count&limit=0`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Prefer': 'count=exact'
      },
    });

    if (res.ok) {
      console.log(`  Table "${table}": EXISTS`);
    } else {
      const text = await res.text();
      if (text.includes('does not exist') || text.includes('relation')) {
        console.log(`  Table "${table}": MISSING - run migration first`);
      } else {
        console.log(`  Table "${table}": ERROR (${res.status})`);
      }
    }
  }
}

async function testStripe() {
  const key = process.env.STRIPE_SECRET_KEY;

  const res = await fetch('https://api.stripe.com/v1/customers?limit=1', {
    headers: { 'Authorization': `Bearer ${key}` },
  });

  if (res.ok) {
    console.log('  Stripe API: OK (sandbox)');
    return true;
  } else {
    const body = await res.json();
    console.log('  Stripe API: FAILED -', body.error?.message || res.status);
    return false;
  }
}

async function testResend() {
  const key = process.env.RESEND_API_KEY;

  const res = await fetch('https://api.resend.com/domains', {
    headers: { 'Authorization': `Bearer ${key}` },
  });

  if (res.ok) {
    const data = await res.json();
    console.log('  Resend API: OK (' + (data.data?.length || 0) + ' domains)');
    return true;
  } else {
    console.log('  Resend API: FAILED (' + res.status + ')');
    return false;
  }
}

async function main() {
  console.log('Testing connections...\n');

  console.log('[Supabase]');
  await testSupabase();
  await testSupabaseTables();

  console.log('\n[Stripe]');
  await testStripe();

  console.log('\n[Resend]');
  await testResend();

  console.log('\nDone.');
}

main().catch(console.error);
