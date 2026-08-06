# adi10_website — Adit Patil's personal site

Personal website + blog themed around software, meditation, consciousness, and
travel. Live at **https://aditpatil.com**. Owner: Adit Patil (GitHub
`aditpatil10`) — a software **developer** (use "developer", not "engineer") who
is a consciousness explorer and traveler.

## Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`, configured in `src/index.css`
  with `@theme` tokens — there is **no** `tailwind.config.js`)
- **React Router 7** (`BrowserRouter`, routes defined in `src/App.tsx`)
- **Framer Motion** for page transitions, scroll reveals, and animations
- **react-markdown** + **remark-gfm** for blog posts
- Audio: **Web Audio API** (synthesized cues) + `HTMLAudioElement` (looped
  nature beds). No audio library.

## Project layout

```
src/
  App.tsx            # router + layout (Loader, Background, Nav, Footer, routes)
  main.tsx           # BrowserRouter entry
  index.css          # Tailwind import + @theme design tokens + keyframes
  components/
    Background.tsx     # fixed aurora blobs + starfield (GPU-composited)
    Loader.tsx         # intro loader: binary "Matrix" digital rain on canvas
    Nav.tsx            # fixed header, desktop + mobile menu
    Footer.tsx         # social links + dynamic © year
    Reveal.tsx         # scroll-in fade/lift wrapper (whileInView once)
    PageTransition.tsx # per-route enter/exit animation
    ScrollToTop.tsx    # resets scroll on route change
    BreathingTimer.tsx # the Practices breathing tool (see Feature notes)
    QuoteCard.tsx      # rotating verified quotes (see Feature notes)
  lib/
    practiceStats.ts   # localStorage streak / minutes / sessions tracking
  pages/             # Home, About, Writings, WritingPost, Practices, NotFound
  content/
    posts.ts         # blog post registry (metadata + imported markdown)
    posts/*.md       # blog post bodies (imported with ?raw)
  assets/
    *.jpg            # hero (home-hero-times-square), portrait (background)
    travel/*.jpg     # About-page gallery photos
    audio/*.mp3      # waves, rain, river, bowl (Practices sounds)
public/
  CNAME              # custom domain: aditpatil.com (MUST stay here)
.github/workflows/deploy.yml   # GitHub Actions → GitHub Pages
```

## Local development

```bash
npm install
npm run dev      # http://localhost:5173  (add -- --host to test on phone/LAN)
npm run build    # type-check + production build into dist/
npx tsc -b       # type-check only (fast, no bundle)
```

**Working style (important):** the owner likes to **preview UI/UX changes on the
local dev server before shipping**. After front-end changes, start `npm run dev`,
share the localhost URL, and only build/commit/push once approved (he'll say
"ship it" / "close the server and ship it"). Small copy-only edits can skip this.

## Deployment — how it works

Hosting is **GitHub Pages on the custom apex domain `aditpatil.com`**, built and
published by **GitHub Actions on every push to `main`**. There is no manual
deploy step — pushing to `main` IS the deploy.

### The standard change → deploy loop (what to do every time)

1. Make the code change.
2. **Verify it builds locally first:** `npm run build` (the workflow runs the
   same `tsc -b && vite build`, so a local failure means a failed deploy).
3. Stage, commit, and push to `main`:
   ```bash
   git add -A
   git commit -m "…"
   git push
   ```
4. **Watch the deploy finish** before reporting done:
   ```bash
   RID=$(gh run list --workflow "Deploy to GitHub Pages" --limit 1 --json databaseId -q '.[0].databaseId')
   gh run watch "$RID" --exit-status --interval 10
   ```
5. Optionally confirm live: `curl -sSL https://aditpatil.com/ | grep -i "<title>"`.

### Key facts / gotchas

- **`vite.config.ts` `base: '/'`** — correct because of the custom apex domain.
  Do NOT change it to `/adi10_website/`; that would break asset paths.
- **CNAME** lives in `public/CNAME` (`aditpatil.com`) so every build ships it to
  `dist/`. Don't delete it or the custom domain breaks.
- **SPA fallback:** `vite.config.ts` has a `spa-404-fallback` plugin that copies
  `dist/index.html` → `dist/404.html`. This makes deep links (e.g. `/about`)
  work on GitHub Pages. Deep links return HTTP 404 but serve the full app, which
  then routes client-side — this is expected, not a bug.
- **Pages source** is set to "GitHub Actions" (`build_type: workflow`), not a
  branch. Already configured.
- **`workflow` OAuth scope:** pushing changes to files under `.github/workflows/`
  requires the gh token to have the `workflow` scope
  (`gh auth refresh -h github.com -s workflow`). Normal code pushes don't need it.
- Every push to `main` deploys, **including doc-only changes** like this file —
  harmless, it just rebuilds the same site.

## Feature notes

### Practices page (`pages/Practices.tsx` + `components/BreathingTimer.tsx`)

The most iterated-on part of the site. The breathing tool:

- **Pattern picker** framed as "How are you feeling?" — each option leads with a
  plain-language use (Feeling anxious / Need to focus / Can't sleep) over the
  technical name (Coherent 5-5 / Box 4-4-4-4 / Calm 4-7-8), plus **numbered
  steps** and a fuller description. Default selected: `coherent` (anxious).
  The steps+description block is keyed by `patternKey` so it fully remounts on
  switch (avoids glitchy DOM reuse when patterns share step text).
- **Session length** 2 / 5 / 10 min with a gradient **progress ring** around the
  orb, live countdown, and a completion summary.
- **Sound**: a *With music / Without music* toggle. "With music" plays a chosen
  **nature bed** (Waves / Rain / River, looped `HTMLAudioElement`, fade in/out).
- **Guiding bells** (Web Audio, synthesized soft bell tones) play on every
  breath phase (in / hold / out) **regardless** of the music choice — pitch
  descends C5 → A4 → F4 so breath direction is legible with eyes closed. A
  **Tibetan bowl** sample rings at completion. Audio is unlocked within the
  Begin tap (`ensureCtx`, `primeBowl`) so it works on iOS.
- **Haptics**: `navigator.vibrate` on inhale/exhale/complete — **Android only**;
  iOS Safari has no web Vibration API (do not try to add it; the `<input switch>`
  hack does not work for timer-driven cues).
- **Streak tracking** via `lib/practiceStats.ts` (localStorage `bt-stats`):
  daily streak, total minutes, total sessions; shown after the first completed
  session.
- Below the tool: a **rotating QuoteCard**.

### QuoteCard (`components/QuoteCard.tsx`)

Rotating verified quotes on breath & consciousness (Nestor, Tolle, Sadhguru,
Thich Nhat Hanh, Dispenza). ‹ › arrows + progress dots, slide animation,
auto-rotate every 8s, pause-on-hover, random start index.
**Quotes must be wording-verified with real attribution** — verify via web
search before adding; never invent or misattribute.

### Loader (`components/Loader.tsx`)

Full-screen intro on first load: binary (1/0) "Matrix" digital rain on a
`<canvas>`, then dissolves. Shown for a calm minimum and until window load, with
a safety cap. It is `pointer-events-none` so it never blocks clicks during its
fade-out.

## Conventions

- **Images:** optimize before committing. Resize/compress with ImageMagick, e.g.
  `magick in.jpg -resize 2400x -quality 80 -strip out.jpg`. Keep hero/background
  images under ~1 MB. Store under `src/assets/` and import them (Vite hashes
  them) rather than putting them in `public/`.
- **Audio:** compress with **ffmpeg** (`brew install ffmpeg`), e.g.
  `ffmpeg -i in.mp3 -ac 2 -b:a 96k out.mp3` (nature beds ~96 kbps, bowl ~128k).
  Store in `src/assets/audio/` and import. Current nature sounds are from
  **Pixabay** (no attribution required). Note: **real-person photos are
  copyrighted** — only use CC/public-domain images and credit per license, or
  use monogram avatars.
- **Fonts:** loaded in `index.html` from Google Fonts and exposed as `@theme`
  tokens: `--font-display` Fraunces (headings), `--font-sans` Inter (body),
  `--font-nav` Cormorant Garamond (nav + wordmark, uppercase letter-spaced),
  `--font-lede` Newsreader (hero intro + pattern descriptions, often italic).
- **Content style:** avoid em dashes (—) in visible copy — use commas, colons,
  or semicolons instead (JSX code comments are fine). Say "developer", not
  "engineer". The footer © year is dynamic (`new Date().getFullYear()`).
- **Adding a blog post:** add a `.md` file in `src/content/posts/`, then register
  it in `src/content/posts.ts` (slug, title, date, readingTime, excerpt, import
  the markdown with `?raw`).
- **Styling:** Tailwind utility classes only; custom colors/fonts/animations are
  defined as tokens in the `@theme` block of `src/index.css`
  (e.g. `night-950`, `aura-400`, `dawn-300`, `font-display`, `animate-aurora`).
- **Safari performance:** avoid per-draw `ctx.shadowBlur` on canvas (very slow),
  and keep large blurred elements GPU-composited (`transform-gpu`,
  `will-change:transform`, translate-only animation) — the `Background` aurora
  and `Loader` follow this. Regressions here cause the page to hang on load.
- Commit only when changes build cleanly; keep the working tree deployable since
  `main` auto-deploys.
```
