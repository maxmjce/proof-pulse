// Run database migration against Supabase
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

async function runMigration() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const sql = fs.readFileSync('supabase/migrations/001_initial_schema.sql', 'utf8');

  console.log('Running migration against:', url);

  const res = await fetch(`${url}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  // Use the SQL endpoint via the management API
  // Supabase REST doesn't support raw SQL, so we use the pg endpoint
  const pgRes = await fetch(`${url}/pg/query`, {
    method: 'POST',
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!pgRes.ok) {
    // Try the SQL API endpoint instead
    console.log('pg/query not available, trying sql endpoint...');

    const sqlRes = await fetch(`${url}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
    });

    if (sqlRes.ok) {
      console.log('Supabase connection works! But raw SQL must be run via SQL Editor.');
      console.log('');
      console.log('Please paste the contents of supabase/migrations/001_initial_schema.sql');
      console.log('into your Supabase Dashboard > SQL Editor and run it.');
      console.log('');
      console.log('URL: ' + url.replace('.supabase.co', '.supabase.co').replace('https://', 'https://supabase.com/dashboard/project/').replace('.supabase.co', ''));
    } else {
      console.error('Supabase connection failed:', sqlRes.status, await sqlRes.text());
    }
    return;
  }

  const result = await pgRes.json();
  console.log('Migration result:', JSON.stringify(result, null, 2));
}

runMigration().catch(console.error);
