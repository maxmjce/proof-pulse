// Usage:
//   node scripts/db.js migrate <file>   — Run a SQL migration file
//   node scripts/db.js query "<sql>"    — Run a raw SQL query
//   node scripts/db.js tables           — List all tables
//   node scripts/db.js seed             — Seed dev data

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

const commands = {
  async migrate(file) {
    if (!file) { console.error('Usage: node scripts/db.js migrate <file>'); process.exit(1); }
    const content = fs.readFileSync(file, 'utf8');
    console.log(`Running migration: ${file}`);
    await sql.unsafe(content);
    console.log('Migration complete.');
  },

  async query(rawSql) {
    if (!rawSql) { console.error('Usage: node scripts/db.js query "<sql>"'); process.exit(1); }
    const rows = await sql.unsafe(rawSql);
    console.log(JSON.stringify(rows, null, 2));
  },

  async tables() {
    const rows = await sql`
      SELECT tablename,
        (SELECT count(*) FROM information_schema.columns c WHERE c.table_name = t.tablename AND c.table_schema = 'public') as columns
      FROM pg_tables t
      WHERE schemaname = 'public'
      ORDER BY tablename`;
    console.log('Tables:');
    rows.forEach(r => console.log(`  ${r.tablename} (${r.columns} columns)`));
  },

  async seed() {
    console.log('Seeding not yet implemented. Add seed data to scripts/seed.sql');
  },
};

const [cmd, ...args] = process.argv.slice(2);
if (!cmd || !commands[cmd]) {
  console.log('Commands: migrate, query, tables, seed');
  process.exit(1);
}
commands[cmd](...args).then(() => sql.end()).catch(e => { console.error(e.message); process.exit(1); });
