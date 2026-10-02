# Элина Тумарева — interactive booklet

A four-page editorial website built with Next.js App Router. Routes: `/`, `/services`, `/about`, and `/reviews`. The shared `BookShell` provides the header, page counter, previous/next navigation, page sweep, and contact sheet.

## Run locally

Requires Node.js 20.9+ and pnpm 11.

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>. Use `pnpm build` for a production check.

## Content and assets

All business copy and links live in `content/site.ts`. The verified Telegram handle supplied for this project is linked through `contact.channels`. Instagram and WhatsApp remain unset. Program duration, format, and price are hidden until confirmed. The express format is visible as `comingSoon`; change its status to `hidden` or `available` when appropriate, and add a verified destination before enabling its CTA.

The approved Elina photos are in `public/images/elina/`. Eight Instagram-sourced reviews are structured in `reviews.items` with full original text, one emphasized original passage, and source URLs. Seven client photos are localized in `public/reviews/`; Yulia retains a neutral initial avatar because no verified portrait is available. The project copies of original images and their source mapping are in `assets/source/README.md`. Run `scripts/prepare-images.py` with Pillow to regenerate the optimized WebP files. The `avatar.clientVerified` and `avatar.republishingApproved` fields gate client photo display.

Set `seo.siteUrl` or `NEXT_PUBLIC_SITE_URL` to the final public origin before launch. The sitemap includes all four routes once that origin is set.

## Temporary GitHub Pages preview

The site exports static HTML to `out/` with `pnpm build`. It needs no Node.js server after the build. The build script also adds `.nojekyll` and compatibility copies of Next.js 16 navigation payloads so page transitions do not request missing files on static hosting. Local `pnpm dev` still runs at <http://localhost:3000> when `NEXT_PUBLIC_BASE_PATH` is unset.

The workflow at `.github/workflows/pages.yml` builds and deploys on pushes to `main` or `master`, and can also be run manually. It derives the project-page prefix from the repository name, so a repository named `portfolio` under `USERNAME` is served at `https://USERNAME.github.io/portfolio/`. A repository named `USERNAME.github.io` is served at the domain root. The workflow sets `PREVIEW_NOINDEX=true`, which emits noindex/nofollow metadata and a disallowing `robots.txt`; omit that variable for the final production build.

For a manual project-page build, set `NEXT_PUBLIC_BASE_PATH=/REPOSITORY`, `NEXT_PUBLIC_SITE_URL=https://USERNAME.github.io/REPOSITORY/`, and `PREVIEW_NOINDEX=true` before `pnpm build`. The base path is baked into the build and must match the published URL. Internal routes use trailing slashes so direct visits to `/services/`, `/about/`, and `/reviews/` resolve to their own `index.html` files. `next/image` uses the local files in `public/` without a server-side optimizer.

In GitHub, create a public repository, push the project source, then open **Settings → Pages → Build and deployment → Source → GitHub Actions**. The workflow will publish the resulting URL under **Actions** and **Settings → Pages**. Do not upload `node_modules/`, `.next/`, or `out/`; they are ignored. Original source photos and local review screenshots are also excluded from the preview repository, while every production image remains in `public/`.

## Interaction

The home headline changes the portrait caption on hover, focus, or tap. Service panels reveal short comparison points on selection. The About path responds to hover, focus, or tap. Reviews keep the full original text in an independently scrollable region, with directional touch swipes for changing people and explicit Instagram source links. Book links trigger a short blue panel sweep; reduced-motion users receive a brief fade. Contact opens as a modal sheet and closes with Escape.
