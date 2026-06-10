# Bookpedia

Search books with the Google Books API and save titles to a session-based wishlist.

## Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/) 10 (`corepack enable`)
- [just](https://github.com/casey/just)
- [Docker](https://www.docker.com/) (for local Postgres and optional app container)

## Environment variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then set your Google Books API key in `.env`:

```env
DATABASE_URL=postgresql://admin:admin123@localhost:5432/bookpedia
GOOGLE_CLOUD_API_KEY=your_google_books_api_key
```

`DATABASE_URL` must match the local Postgres credentials in `infra/docker-compose.local.yml` when running locally.

## Local development

Install dependencies:

```bash
just install
```

Start Postgres (and pgweb):

```bash
just services
```

Run database migrations:

```bash
just db-migrate
```

Start the dev server:

```bash
just dev
```

Open [http://localhost:3000](http://localhost:3000).

### Useful local services

| Service | URL |
| --- | --- |
| App | http://localhost:3000 |
| Postgres | `localhost:5432` |
| pgweb (DB UI) | http://localhost:8081 |

Stop local services:

```bash
just services-down
```

Remove local service data:

```bash
just clean
```

## Production build

```bash
just build
just start
```

`just build` runs migrations, then builds the Next.js app.

## Docker (app container)

Build the image:

```bash
just docker-build
```

The Docker image sets `OUTPUT_MODE=standalone` at build time. Vercel deployments do not set this and use the default Next.js output.

## Commands

| Command | Description |
| --- | --- |
| `just install` | Install dependencies |
| `just dev` | Start the dev server |
| `just build` | Run migrations and build the app |
| `just start` | Start the production server |
| `just services` | Start Postgres and pgweb |
| `just services-down` | Stop Postgres and pgweb |
| `just clean` | Stop services and remove local DB data |
| `just db-migrate` | Apply migrations |
| `just db-generate` | Generate a migration from schema changes |
| `just db-push` | Push schema directly (dev only) |
| `just docker-build` | Build the app Docker image |

## Deploying to Vercel

1. Push the repo to GitHub and import it in Vercel.
2. Set `DATABASE_URL` and `GOOGLE_CLOUD_API_KEY` in the Vercel project environment.
3. Use a hosted Postgres provider (for example Neon). Do not set `OUTPUT_MODE` on Vercel.

Run migrations against your production database before or as part of your deploy process.
