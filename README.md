# Reelty — Project Alpha (Phase 1 prototype)

Clickable front-end sample for the real-estate content SaaS. Backend is **mocked**;
real HeyGen / Placid / GHL / Claude wiring comes in Phase 2.

## Run it
```bash
cd "02 Projects/Project Alpha/web"
npm install
npm run dev
```
Open http://localhost:4200

## What's here
- **Marketing site** (`/`) — hero, how-it-works, features, pricing, FAQ.
- **Auth stub** (`/login`, `/signup`) — any details go to the dashboard.
- **Agent dashboard** (`/dashboard`):
  - `create` — pick type → inputs → Claude writes script (edit/rewrite) → "film avatar" → done
  - `picture-posts` — Placid-style fill-in-the-blanks templates with live preview
  - `library` — content grid + approve/schedule drawer
  - `schedule` — upcoming posts, approve-before-posting guard
  - `settings` — brand kit, digital twin, connected socials, plan

## Backend integration layer (the important part)
Every external service is reached through one typed port in `lib/integrations/`:

| Port | Mock file | Phase 2 target |
|---|---|---|
| `ScriptProvider` | `claude.ts` | Claude Messages API |
| `VideoProvider` | `heygen.ts` | HeyGen avatar render API |
| `PictureProvider` | `placid.ts` | Placid template API |
| `SchedulerProvider` | `ghl.ts` | GoHighLevel Social Planner |

Swap mocks for real clients in `lib/integrations/index.ts` — the UI and API routes
(`app/api/*`) never change. See `[C] Project Overview.md` for scope, pricing and the
HeyGen digital-twin Enterprise flag.

## Stack
Next.js 14 (App Router) · TypeScript · Tailwind CSS · lucide-react.
```
