# ProofPulse Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase
1. Create a project at https://supabase.com
2. Go to SQL Editor and run `supabase/migrations/001_initial_schema.sql`
3. Go to Settings > API and copy your project URL and anon key
4. (Optional) Enable Google OAuth in Authentication > Providers

### 3. Set Up Stripe
1. Create an account at https://stripe.com
2. Create two products in the Dashboard:
   - **Creator** ($19/month)
   - **Business** ($49/month)
3. Copy the price IDs for each product
4. Set up a webhook endpoint pointing to `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### 4. Set Up Resend
1. Create an account at https://resend.com
2. Add and verify your domain
3. Create an API key

### 5. Configure Environment Variables
Copy `.env.example` to `.env.local` and fill in all values:
```bash
cp .env.example .env.local
```

### 6. Run Development Server
```bash
npm run dev
```
Open http://localhost:3000

### 7. Deploy to Vercel
```bash
npx vercel
```
Add all environment variables in the Vercel dashboard.

## Development

### Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — Lint code

### Project Structure
See `CLAUDE.md` for full architecture documentation.

## Claude Code Workflow

This project is configured for autonomous Claude Code development. When you open Claude Code in this directory:

1. Claude has full permissions (no confirmation prompts needed)
2. CLAUDE.md contains the complete project spec
3. The database schema is in `supabase/migrations/`
4. All pages are scaffolded — fill in the TODO items

### Suggested prompts to continue building:
- "Connect the dashboard to real Supabase data"
- "Build the form builder with drag-and-drop"
- "Implement the widget embed JavaScript"
- "Set up Stripe checkout flow"
- "Add email campaign automation with Resend"
- "Write tests for the API routes"
- "Build the complete app end-to-end"
