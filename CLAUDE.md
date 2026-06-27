# adi10_website — Adit Patil's personal site

Personal website + blog themed around software, meditation, and consciousness
exploration. Live at **https://aditpatil.com**.

## Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`, configured in `src/index.css` with
  `@theme` tokens — there is no `tailwind.config.js`)
- **React Router 7** (`BrowserRouter`, routes defined in `src/App.tsx`)
- **Framer Motion** for page transitions / scroll reveals
- **react-markdown** + **remark-gfm** for blog posts

## Project layout

```
src/
  App.tsx            # router + layout (Nav, Background, Footer, routes)
  main.tsx           # BrowserRouter entry
  index.css          # Tailwind import + @theme design tokens + keyframes
  components/         # Background, Nav, Footer, Reveal, PageTransition, BreathingTimer, ScrollToTop
  pages/             # Home, About, Writings, WritingPost, Practices, NotFound
  content/
    posts.ts         # blog post registry (metadata + imported markdown)
    posts/*.md        # blog post bodies (imported with ?raw)
  assets/            # images (hero, portrait, travel/)
public/
  CNAME              # custom domain: aditpatil.com (MUST stay here)
.github/workflows/deploy.yml   # GitHub Actions → GitHub Pages
```

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
```

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

## Conventions

- **Images:** optimize before committing. Large photos are resized/compressed
  with ImageMagick, e.g.
  `magick in.jpg -resize 2400x -quality 80 -strip out.jpg`. Keep hero/background
  images under ~1 MB. Store under `src/assets/` and import them (Vite hashes
  them) rather than putting them in `public/`.
- **Adding a blog post:** add a `.md` file in `src/content/posts/`, then register
  it in `src/content/posts.ts` (slug, title, date, readingTime, excerpt, import
  the markdown with `?raw`).
- **Styling:** Tailwind utility classes only; custom colors/fonts/animations are
  defined as tokens in the `@theme` block of `src/index.css`
  (e.g. `night-950`, `aura-400`, `dawn-300`, `font-display`, `animate-aurora`).
- Commit only when changes build cleanly; keep the working tree deployable since
  `main` auto-deploys.
