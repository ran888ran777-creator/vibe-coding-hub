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
3. Start local Postgres: `npm run db:up`
4. Generate Prisma client: `npm run prisma:generate`
5. Apply migrations: `npm run prisma:migrate`
6. Start dev server: `npm run dev`
7. Open `http://localhost:3000/auth/register` and create the first local account.

## Local MVP mode

- When `DEV_USE_MOCK_SERVICES=true`, document parsing, summaries, and Q&A still work without Firecrawl/OpenAI keys.
- URL mode works immediately in mock mode.
- File uploads also work in mock mode using a local fallback storage path.

## Notes

- File uploads require R2-compatible env vars.
- URL parsing works as soon as `FIRECRAWL_API_KEY` is configured.
- Local auth uses password hashing plus a signed session cookie.
- Parse and summary are queued into DB-backed background jobs and processed by the in-process runner in local mode.
