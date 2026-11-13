# Personal Page (Next.js 14 + MDX + YouTube)

A modern personal website built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui primitives, and framer-motion.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- shadcn/ui style components (Radix-based)
- framer-motion animations
- lucide-react icons
- MDX/Markdown content in `/content`
- Podcast episodes and shorts from the YouTube channel (feed or Data API)

## Quick Start

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment:

```bash
cp .env.example .env.local
```

3. Start development server:

```bash
pnpm dev
```

4. Production build:

```bash
pnpm build
pnpm start
```

## Run with Docker (Local)

### Option A: Docker Compose (recommended)

1. Create env file:

```bash
cp .env.example .env.local
```

2. Build and start container:

```bash
docker compose up --build
```

3. Open:

`http://localhost:3000`

### Option B: Plain Docker

Build image:

```bash
docker build -t personal-page:local .
```

Run container:

```bash
docker run --rm -p 3000:3000 \
  personal-page:local
```

## Content Editing

All primary content is local and file-based:

- `content/education.pl.mdx` and `content/education.en.mdx`
- `content/career-current.pl.mdx` and `content/career-current.en.mdx`
- `content/experience.pl.mdx` and `content/experience.en.mdx`
- `content/podcast.pl.mdx` and `content/podcast.en.mdx`
- `content/shorts.json`
- `content/intro.srt` and `content/intro-transcript.json`

Podcast episodes and shorts come from the YouTube channel (`YOUTUBE_CHANNEL_ID`, optional `YOUTUBE_API_KEY`).

## Site Config

Edit global site identity and links in:

- `src/config/site.ts`

Config includes:

- Site name, author, role, location
- Social links
- YouTube channel ID (env override supported)
- Voice intro audio/image source used on homepage narrator card
- Locale toggle (`PL/EN`) is in the top navigation and persists via cookie (`site_locale`)

## Voice Intro (Local MP3 + Transcript)

Homepage voice card uses:

- `public/audio/intro.mp3`
- `content/intro-transcript.json` (timestamped subtitles)
- `content/intro.srt` (editable subtitle source)

Optional settings live in `src/config/site.ts` under `voiceIntro`.

## Routes

- `/` Home
- `/about` About
- `/experience` Career timeline + current role
- `/education` Education
- `/podcast` Podcast overview + episodes + shorts
- `/projects` Projects + live Argo CD panel
- `/contact` Contact links

## SEO

Implemented:

- Metadata title template + description
- OpenGraph defaults
- `robots.ts`
- `sitemap.ts`

## Deployment

### Vercel

1. Push repository to GitHub.
2. Import project in Vercel.
3. Set `YOUTUBE_CHANNEL_ID`, `YOUTUBE_API_KEY`, `ARGOCD_URL` and `ARGOCD_TOKEN` in project environment variables.
4. Deploy.

### Cloudflare Pages

1. Connect repository in Cloudflare Pages.
2. Build command: `pnpm build`
3. Output directory: `.next`
4. Use Cloudflare's Next.js support with adapter (OpenNext/official integration) depending on your Pages setup.
5. Set the same environment variables as for Vercel.

## Notes

- YouTube fetch failures are handled gracefully on `/podcast` with fallback messaging.
