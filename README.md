# ECONS Task

A responsive Next.js recreation of the public Econs Consultant website.

## Architecture

- `app/` contains the minimal Next.js application shell and metadata.
- `public/clone.html` is the stable document entry point used to preserve the
  reference site's structure and visual behavior.
- `public/assets/index-*.js` and `public/assets/index-*.css` are immutable vendor
  artifacts captured from the reference site.
- `public/assets/enhancements/` contains the authored, reusable ES modules for
  localization, newsletter validation, navigation accessibility, branch links,
  image loading, toast feedback, and floating controls.
- `public/assets/econs-enhancements.css` contains the authored responsive and
  accessibility refinements.

The vendor bundle is intentionally isolated from authored code. This keeps the
visual clone faithful while making custom behavior easy to review and maintain.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run check
npm run build
```

The implementation includes English and Arabic localization, responsive
navigation, bidirectional journey scrolling, accessible keyboard behavior,
validated newsletter feedback, Google Maps branch links, and collision-aware
floating actions.
