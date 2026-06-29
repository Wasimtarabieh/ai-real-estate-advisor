# AI Real Estate Investment Advisor

A modern web platform that helps investors find the best real estate opportunities through a personalized matching engine.

## Tech Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Prisma** + **PostgreSQL**
- Rule-based matching engine (AI-ready architecture)

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── assessment/           # Multi-step assessment flow
│   ├── admin/                # Admin dashboard
│   └── api/                  # REST API routes
├── lib/
│   ├── prisma.ts             # Database client
│   └── matching.ts           # Matching engine
└── types/                    # TypeScript types
```

## Roadmap

- [ ] AI Recommendation Engine
- [ ] Chat Assistant
- [ ] CRM for advisors
- [ ] Multi-language support
- [ ] Project comparison
- [ ] PDF reports
- [ ] Calendly / Google Calendar integration
