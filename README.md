# Kaizen

Kaizen is a personal productivity and learning app for managing daily tasks, collecting useful content, saving ideas, tracking skills, and organizing thoughts from books and reflection.

This is the initial foundation: a clean Next.js dashboard with prepared sections that can grow over time.

## Tech Stack

- Next.js with App Router
- TypeScript
- Tailwind CSS
- Supabase-ready client setup
- Mobile-first responsive layout

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Supabase Environment Variables

Copy `.env.local.example` to `.env.local` and add your Supabase values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The Supabase client lives in `lib/supabase/client.ts`. Keys are read from environment variables and are not hardcoded.

## Project Structure

```text
app/
  page.tsx                 Landing page
  (dashboard)/
    layout.tsx             Dashboard shell
    home/page.tsx          Daily overview
    sharkmo/page.tsx       Brand and content ideas
    skills/page.tsx        Learning resources
    socrate/page.tsx       Books and reflections
    archive/page.tsx       Saved content archive
components/
  layout/                  Sidebar, bottom navigation, nav items
  concept-grid.tsx         Reusable placeholder card grid
  page-header.tsx          Reusable page heading
  section-card.tsx         Reusable dashboard section wrapper
  task-card.tsx            Reusable task card
lib/
  supabase/client.ts       Supabase browser client setup
```

## Current Sections

- Home: daily overview, task cards, priority indicators, calendar placeholder
- Sharkmo: concepts, hooks, post ideas, philosophy references
- Skills: videos, reels, tutorials, tips
- Socrate: books, reflections, themes, recurring ideas
- Archive: filters for links, videos, notes, ideas, and books
