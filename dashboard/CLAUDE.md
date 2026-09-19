# Content Dashboard — Project Memory

This file is the source of truth for how this app is built and why. Keep it
up to date as decisions change — future work (by Claude or anyone else)
should read this first.

## What this is

A placeholder content-operations dashboard with five sections behind a
shared sidebar:

- **Instagram Manager** (`/instagram`)
- **Analytics** (`/analytics`)
- **Content Calendar** (`/calendar`)
- **Competitor Tracker** (`/competitors`)
- **News Feed** (`/news`)

Every section is currently a static placeholder ("Coming soon" card) — no
data fetching, auth, or backend integration exists yet. The `/` route is an
overview page with cards linking into each section.

## Where this lives in the repo

This repo (`ig-story-remotion`) originally holds an unrelated Remotion video
template (`src/`, `remotion.config.ts` at repo root — generates Instagram
Story videos). The dashboard is a **separate Next.js app** in `dashboard/`
at the repo root, with its own `package.json`, `node_modules`, and git
history going forward. **Decision:** keep them as two independent projects
in one repo rather than merging tooling or converting the Remotion project,
since they solve unrelated problems (video rendering vs. a web dashboard)
and have incompatible runtimes. Run all dashboard commands from inside
`dashboard/`.

## Tech stack

- **Next.js 14** (App Router, `src/` directory), pinned via
  `create-next-app@14`. **Decision:** the `latest` tag at the time this was
  built resolved to Next 16, whose own generated `AGENTS.md` explicitly
  warns that it has breaking changes vs. general model training data and
  says to read `node_modules/next/dist/docs/` before writing code. To avoid
  building on undocumented/unfamiliar APIs, we pinned to the well-established
  Next 14 App Router conventions instead.
- **React 18** (matches the Next 14 template; not React 19).
- **TypeScript**, strict mode (from the `create-next-app` default
  `tsconfig.json`).
- **Tailwind CSS v3.4** for styling (not v4 — v4's setup differs
  meaningfully and v3 is what shadcn/ui's known-good primitives assume).
- **shadcn/ui components, hand-written (not CLI-generated).** **Decision
  and why:** the shadcn CLI's registry endpoint (`ui.shadcn.com`) is blocked
  by this environment's outbound network policy (403 at the proxy level),
  and the latest CLI (`shadcn@4.x`) also uses a new `--base radix|base|aria`
  "base-nova" preset system that's a departure from the classic
  `components.json` format. So the primitives in `src/components/ui/`
  (`button.tsx`, `card.tsx`, `badge.tsx`, `separator.tsx`) were written by
  hand, matching the standard/"new-york"-style shadcn source exactly
  (same variants, same `cva` usage, same `cn()` helper), so they are
  drop-in compatible if the CLI is ever usable later (e.g.
  `npx shadcn@2.9.3 add <component>` against the existing
  `components.json`). A `components.json` is committed so the CLI works
  immediately if network access to `ui.shadcn.com` is available in the
  future.
  - Only `button`, `card`, `badge`, and `separator` exist so far — add more
    the same way (hand-write matching upstream shadcn source, or run the
    CLI) as sections gain real functionality.
- **lucide-react** for icons. **Decision:** the installed version (`^1.x`)
  removed all brand/logo icons (no `Instagram` icon export) — this is an
  intentional upstream change, not a bug. The sidebar uses `Camera` for
  Instagram Manager instead of a literal Instagram glyph.
- **class-variance-authority**, **clsx**, **tailwind-merge**,
  **tailwindcss-animate** — the standard shadcn/ui variant + class-merging
  toolchain (`cn()` lives in `src/lib/utils.ts`).
- **@radix-ui/react-slot**, **@radix-ui/react-separator** — primitives
  backing the `Button` (`asChild`) and `Separator` components.
  `@radix-ui/react-tooltip` is installed but not yet used by anything.

## Dark theme

**Decision:** dark is the only theme — there is no light mode or theme
toggle. `<html>` in `src/app/layout.tsx` has a hardcoded `className="dark"`.
All shadcn color tokens (`--background`, `--foreground`, `--card`,
`--primary`, `--border`, plus dashboard-specific `--sidebar-*` tokens) are
defined once under `:root` in `src/app/globals.css` using dark values —
there's no separate `.light`/`.dark` variable split to keep in sync, since
light mode doesn't exist. If a light mode is ever added, split these into
`.dark`/`:root` blocks and wire up a theme provider (e.g. `next-themes`)
first.

## Folder structure

```
dashboard/
├── CLAUDE.md                     # this file
├── components.json               # shadcn/ui config (style: new-york, base: neutral)
├── tailwind.config.ts            # shadcn design tokens (HSL CSS vars) + tailwindcss-animate
├── src/
│   ├── app/
│   │   ├── layout.tsx            # root shell: <html class="dark">, renders Sidebar + MobileNav + <main>
│   │   ├── page.tsx               # "/" — overview page, cards linking to each section
│   │   ├── globals.css           # Tailwind directives + shadcn CSS variables (dark only)
│   │   ├── instagram/page.tsx    # Instagram Manager placeholder
│   │   ├── analytics/page.tsx    # Analytics placeholder
│   │   ├── calendar/page.tsx     # Content Calendar placeholder
│   │   ├── competitors/page.tsx  # Competitor Tracker placeholder
│   │   └── news/page.tsx         # News Feed placeholder
│   ├── components/
│   │   ├── ui/                   # hand-written shadcn/ui primitives (button, card, badge, separator)
│   │   └── layout/
│   │       ├── nav-items.ts      # single source of truth for sidebar/mobile-nav links (title, href, icon, description)
│   │       ├── sidebar.tsx       # fixed desktop sidebar (md+), active-link highlighting via usePathname
│   │       ├── mobile-nav.tsx    # top bar + toggle nav shown below md breakpoint
│   │       ├── page-header.tsx   # shared "<Title> [Placeholder badge] + description" header for section pages
│   │       └── coming-soon.tsx   # shared dashed-card placeholder body for section pages
│   └── lib/
│       └── utils.ts              # cn() — clsx + tailwind-merge
```

**Decision:** every section page follows the same two-piece pattern —
`PageHeader` (title + "Placeholder" badge + description) followed by
`ComingSoon` (icon + one-line description of what will eventually live
there). This keeps the five placeholder pages trivial to extend later:
when a section gets real functionality, replace the `<ComingSoon />` call
with real content and leave `PageHeader` as-is.

**Decision:** `navItems` in `nav-items.ts` is the single source of truth for
the sidebar — both `sidebar.tsx` (desktop) and `mobile-nav.tsx` (mobile)
import it, so adding/reordering/renaming a section only requires editing
that one array.

## Navigation / responsive behavior

- **Desktop (`md:` and up):** a fixed, always-visible left sidebar
  (`src/components/layout/sidebar.tsx`), 16rem (`w-64`) wide. `<main>` gets
  `md:pl-64` to sit next to it.
- **Mobile (below `md`):** the fixed sidebar is hidden (`hidden md:flex`);
  instead `mobile-nav.tsx` renders a top bar with a hamburger toggle that
  expands an inline nav list. **Decision:** this is a plain `useState`
  toggle, not a shadcn `Sheet`/Radix `Dialog` — kept dependency-free since
  a full slide-in drawer wasn't needed for placeholder pages. Revisit if
  the mobile nav needs to overlay content, trap focus, etc.
- Active link state is determined by `usePathname()` (`pathname === href`
  or a sub-route) in both nav components.

## Known constraints / environment notes

- Package installs go through `registry.npmjs.org`, which this environment
  allow-lists directly (not proxied) — `npm install` works normally.
- `ui.shadcn.com` (the shadcn/ui component registry) is **blocked** by the
  environment's outbound proxy policy — do not rely on `npx shadcn add ...`
  working; write new primitives by hand against `components.json`'s config
  (style: `new-york`, base color: `neutral`, css variables: on) instead.
- `npm audit` reports pre-existing vulnerabilities inherited from the
  `create-next-app@14` template's own devDependencies (old `eslint`/`glob`
  transitive deps). Not addressed here — fixing them means upgrading
  `eslint`/`eslint-config-next` majors, which is out of scope for scaffolding.

## Verified working

- `npm run build` — production build succeeds, all 5 section routes plus
  `/` prerender as static pages.
- `npm run lint` — no ESLint warnings or errors.
- `npx tsc --noEmit` — no type errors.
- Manually verified in a headless browser: sidebar renders, active-link
  highlighting works when navigating between sections, dark theme applies,
  and the mobile breakpoint correctly swaps to the hamburger top bar.

## Commands

```bash
cd dashboard
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```
