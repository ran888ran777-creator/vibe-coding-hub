# Doc Workspace

Production-minded MVP for document parsing on top of Firecrawl Document Parsing.

## Stack

- Next.js App Router
- Prisma + Postgres
- Cloudflare R2-compatible storage
- Firecrawl for parsing
- OpenAI for summaries and Q&A

## Local setup

1. Copy `.env.example` to `.env`.
2. Install dependencies: `npm install`
3. Generate Prisma client: `npm run prisma:generate`
4. Apply migrations once schema is finalized: `npm run prisma:migrate`
5. Start dev server: `npm run dev`

## Notes

- File uploads require R2-compatible env vars.
- URL parsing works as soon as `FIRECRAWL_API_KEY` is configured.
- Auth is currently scaffolded with a single development user placeholder and should be replaced with Clerk or Supabase Auth before production launch.
