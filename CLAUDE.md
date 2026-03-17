# ProofPulse — Social Proof & Testimonial Platform

## What This Project Is
ProofPulse is a SaaS webapp that lets businesses collect, manage, and display customer testimonials through shareable links and embeddable widgets. Revenue model: freemium with $19/mo and $49/mo paid tiers.

## Tech Stack
- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (Postgres + Auth + Storage)
- **Payments**: Stripe (Checkout + Webhooks + Customer Portal)
- **Email**: Resend (testimonial request automation)
- **State**: Zustand (client state), React Hook Form + Zod (forms)
- **UI**: Radix UI primitives + custom components
- **Deployment**: Vercel

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Auth pages (login, signup, callback)
│   ├── (dashboard)/        # Protected dashboard pages
│   │   ├── dashboard/      # Main dashboard
│   │   ├── testimonials/   # Manage testimonials
│   │   ├── widgets/        # Widget builder/config
│   │   ├── campaigns/      # Email campaign management
│   │   └── settings/       # Account & billing settings
│   ├── collect/[slug]/     # Public testimonial collection page
│   ├── api/                # API routes
│   │   ├── webhooks/       # Stripe & external webhooks
│   │   ├── testimonials/   # CRUD endpoints
│   │   ├── widget/         # Widget embed endpoint
│   │   └── campaigns/      # Email campaign endpoints
│   └── embed/              # Widget embed renderer (iframe)
├── components/
│   ├── ui/                 # Base UI components (button, input, card, etc.)
│   ├── dashboard/          # Dashboard-specific components
│   ├── testimonials/       # Testimonial display components
│   ├── widgets/            # Widget preview/builder components
│   └── landing/            # Landing page components
├── lib/
│   ├── supabase/           # Supabase client (server + browser)
│   ├── stripe/             # Stripe helpers
│   ├── resend/             # Email templates and sending
│   ├── utils.ts            # Utility functions (cn, formatDate, etc.)
│   └── constants.ts        # App constants, pricing tiers
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand stores
└── types/                  # TypeScript type definitions
```

## Database Schema (Supabase)
```sql
-- Users table (extends Supabase auth.users)
profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  email text,
  full_name text,
  company_name text,
  plan text DEFAULT 'free',        -- free | creator | business
  stripe_customer_id text,
  stripe_subscription_id text,
  testimonial_count int DEFAULT 0,
  created_at timestamptz
)

-- Testimonial collection forms
forms (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles,
  name text,                        -- "After Purchase", "Project Complete"
  slug text UNIQUE,                 -- public URL slug
  title text,                       -- heading shown to reviewer
  description text,                 -- instructions for reviewer
  questions jsonb,                  -- custom questions
  thank_you_message text,
  collect_video boolean DEFAULT false,
  collect_rating boolean DEFAULT true,
  branding jsonb,                   -- colors, logo
  is_active boolean DEFAULT true,
  created_at timestamptz
)

-- Collected testimonials
testimonials (
  id uuid PRIMARY KEY,
  form_id uuid REFERENCES forms,
  user_id uuid REFERENCES profiles,
  author_name text,
  author_email text,
  author_title text,                -- "CEO at Acme"
  author_avatar_url text,
  content text,                     -- the testimonial text
  rating int,                       -- 1-5 stars
  video_url text,
  status text DEFAULT 'pending',   -- pending | approved | rejected
  tags text[],
  is_featured boolean DEFAULT false,
  source text DEFAULT 'form',      -- form | import | manual
  created_at timestamptz
)

-- Embeddable widgets
widgets (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles,
  name text,
  type text DEFAULT 'carousel',    -- carousel | wall | badge | minimal
  config jsonb,                    -- colors, layout, animation settings
  testimonial_ids uuid[],         -- selected testimonials (null = auto)
  filter_tags text[],
  show_branding boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamptz
)

-- Email campaigns for collecting testimonials
campaigns (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles,
  form_id uuid REFERENCES forms,
  name text,
  subject text,
  body text,
  recipient_emails text[],
  status text DEFAULT 'draft',     -- draft | scheduled | sent
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz
)
```

## Code Conventions
- **Indentation**: 2 spaces
- **Components**: Named exports, PascalCase filenames
- **API routes**: Use Next.js Route Handlers (app/api/*)
- **Validation**: Zod schemas for all API inputs
- **Error handling**: Try/catch in API routes, return proper HTTP status codes
- **Imports**: Use @/* path alias
- **Styling**: Tailwind utility classes, use `cn()` helper for conditional classes
- **Types**: Define in src/types/, export from index.ts barrel file
- **Server vs Client**: Default to Server Components. Add 'use client' only when needed (interactivity, hooks, browser APIs)

## MVP Features (Build in This Order)
1. **Auth** — Supabase email/password + OAuth (Google)
2. **Dashboard** — Overview with testimonial count, recent activity
3. **Form Builder** — Create/edit testimonial collection forms
4. **Public Collection Page** — `/collect/[slug]` where customers submit testimonials
5. **Testimonial Management** — List, approve/reject, tag, feature
6. **Widget Builder** — Configure embeddable widgets, preview, copy embed code
7. **Widget Embed** — JavaScript snippet that renders testimonials on any site
8. **Email Campaigns** — Send testimonial request emails via Resend
9. **Stripe Billing** — Free/Creator/Business tiers, upgrade/downgrade
10. **Landing Page** — Marketing page with pricing, features, CTA

## Pricing Tiers
```
Free:     $0/mo  — 10 testimonials, 1 form, 1 widget, ProofPulse branding
Creator:  $19/mo — 100 testimonials, 5 forms, 5 widgets, custom branding, video
Business: $49/mo — Unlimited everything, white-label, API access, priority support
```

## Environment Variables (in .env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing Strategy
- **Unit tests**: Vitest for utility functions and API logic
- **Component tests**: Vitest + React Testing Library
- **E2E tests**: Playwright for critical flows (signup, submit testimonial, embed widget)
- Run tests: `npm test` (unit/component), `npx playwright test` (e2e)

## Commands
- `npm run dev` — Start dev server (port 3000)
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm test` — Run Vitest tests
- `npm run test:e2e` — Run Playwright E2E tests
- `npm run db:migrate` — Apply Supabase migrations
- `npm run db:seed` — Seed development data

## Development Workflow
1. Always run `npm run build` after making changes to verify no TypeScript errors
2. Run `npm run lint` before committing
3. Write tests for new features
4. Use conventional commits (feat:, fix:, refactor:, docs:, test:)

## Key Design Decisions
- **App Router only** — no Pages Router, no getServerSideProps
- **Server Actions** for mutations where possible (form submissions, CRUD)
- **Route Handlers** for webhook endpoints and public APIs
- **Middleware** for auth protection on /dashboard/* routes
- **Widget embed** uses an iframe pointing to /embed/[widgetId] for isolation
- **Supabase RLS** (Row Level Security) for all tables — users can only access their own data
