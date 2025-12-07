# ResumePilot.ai - Complete Setup Guide

A production-ready SaaS application for AI-powered CV and cover letter generation.

## Features

- AI-powered CV generation with OpenAI GPT-4
- Cover letter generation tailored to job descriptions
- ATS (Applicant Tracking System) analysis
- PDF text extraction for CV optimization
- Stripe payment integration (Free, Pro, Enterprise plans)
- Supabase authentication and database
- Dark mode support
- Responsive design with Tailwind CSS
- TypeScript for type safety

## Prerequisites

- Node.js 18+ installed
- OpenAI API key
- Stripe account (for payments)
- Supabase account (already configured)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create or update `.env` file in the root directory:

```env
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI (REQUIRED)
OPENAI_API_KEY=sk-your-openai-api-key

# Stripe (REQUIRED for payments)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRO_PRICE_ID=price_your-pro-price-id
STRIPE_ENTERPRISE_PRICE_ID=price_your-enterprise-price-id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Database

Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  credits integer DEFAULT 3 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('cv', 'cover_letter', 'ats_analysis')),
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can create own documents"
  ON documents FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own documents"
  ON documents FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete')),
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own subscription"
  ON subscriptions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## Getting API Keys

### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API Keys → Create new secret key
4. Copy the key and add to `.env`

### Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up or log in
3. Get API keys from Developers → API keys
4. Create products in Products section:
   - **Pro Plan**: $9/month recurring
   - **Enterprise Plan**: $49/month recurring
5. Copy Price IDs for each product
6. Set up webhook:
   - Go to Developers → Webhooks → Add endpoint
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
   - Copy webhook signing secret

## Project Structure

```
/app
  /api              - API routes (OpenAI integration)
    /generate-cv    - CV generation endpoint
    /optimize-cv    - CV optimization endpoint
    /cover-letter   - Cover letter generation
    /ats            - ATS analysis endpoint
    /extract-pdf    - PDF text extraction
    /checkout       - Stripe checkout
    /billing-portal - Stripe billing portal
    /webhooks       - Stripe webhook handlers
  /cv               - CV generator page
  /cover-letter     - Cover letter generator page
  /dashboard        - User dashboard
  /login            - Authentication pages
  /signup
  /account
  /pricing

/components
  /ui               - Reusable UI components (shadcn/ui)
  navigation.tsx    - Main navigation with dark mode
  footer.tsx        - Footer component
  theme-provider.tsx - Dark mode provider

/lib
  openai.ts         - OpenAI integration (5 AI functions)
  stripe.ts         - Stripe integration
  supabase.ts       - Supabase client
  supabase-server.ts - Server-side Supabase helpers
  utils.ts          - Utility functions
```

## Key Features Implemented

### AI Functions
- `generateCV()` - Creates professional CV from user input
- `optimizeCV()` - Tailors CV to specific job descriptions
- `generateCoverLetter()` - Creates personalized cover letters
- `analyzeATS()` - Provides ATS compatibility score
- `rewriteText()` - General text improvement

### Authentication
- Email/password sign up and login
- Password reset flow
- Secure session management with Supabase

### Payment System
- Free tier: 3 AI generations
- Pro plan: $9/month, 50 generations
- Enterprise plan: $49/month, unlimited
- Stripe checkout integration
- Customer billing portal
- Automatic credit management via webhooks

### UI/UX
- Dark mode support
- Responsive design (mobile → desktop)
- Professional landing page with:
  - Hero section
  - Feature highlights
  - Testimonials
  - FAQ accordion
  - Pricing cards
- Dashboard for document management
- Real-time feedback and loading states

## API Endpoints

### Public Routes
- `GET /` - Landing page
- `GET /pricing` - Pricing page
- `GET /login` - Login page
- `GET /signup` - Signup page

### Protected Routes (Authentication Required)
- `POST /api/generate-cv` - Generate CV
- `POST /api/optimize-cv` - Optimize CV for job
- `POST /api/cover-letter` - Generate cover letter
- `POST /api/ats` - Analyze CV for ATS
- `POST /api/extract-pdf` - Extract text from PDF
- `GET /api/documents` - Get user documents
- `DELETE /api/documents?id=` - Delete document
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

### Stripe Routes
- `POST /api/checkout` - Create checkout session
- `POST /api/billing-portal` - Access billing portal
- `POST /api/webhooks/stripe` - Handle Stripe events

## Troubleshooting

### OpenAI API Errors
- Ensure API key is valid and has credits
- Check rate limits on your OpenAI account
- Restart dev server after changing `.env`

### Stripe Integration Issues
- Verify all Price IDs match your Stripe products
- Test with Stripe test mode keys first
- Use Stripe CLI for local webhook testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Database Errors
- Confirm Supabase credentials are correct
- Verify all tables are created with RLS enabled
- Check browser console for detailed error messages

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run typecheck`

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `OPENAI_API_KEY` | Yes | OpenAI API secret key |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `STRIPE_PRO_PRICE_ID` | Yes | Stripe Pro plan price ID |
| `STRIPE_ENTERPRISE_PRICE_ID` | Yes | Stripe Enterprise plan price ID |
| `NEXT_PUBLIC_APP_URL` | Yes | Application URL (for redirects) |

## Production Deployment

1. Update `NEXT_PUBLIC_APP_URL` to your production domain
2. Use production Stripe keys (starts with `sk_live_`)
3. Update Stripe webhook URL to production endpoint
4. Enable Supabase email confirmations (optional)
5. Set up monitoring and error tracking

## Support

For issues or questions:
- Check the [FAQ section](http://localhost:3000) on the homepage
- Email: support@resumepilot.ai
- Review troubleshooting section above

## License

Proprietary - All rights reserved

---

Built with Next.js, TypeScript, Tailwind CSS, Supabase, Stripe, and OpenAI.
