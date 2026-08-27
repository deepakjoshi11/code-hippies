# Brand assets — drop your files here

Every file below already exists as a working placeholder, so the site deploys
today. Replace any of them by overwriting the file with the same name. No code
changes are needed.

| File | Size | Used for |
| --- | --- | --- |
| `logo.svg` | any ratio | Full wordmark. Not currently rendered — supply it if you want a wordmark instead of the mark. |
| `logo-mark.svg` | square | Header and footer mark. **Set `NEXT_PUBLIC_HAS_CUSTOM_LOGO=true`** to switch from the generated monogram to this file. |
| `icon.svg` | square, legible at 16px | Favicon. Also copied to `src/app/icon.svg` — replace both. |
| `apple-icon.png` | 180×180 | iOS home-screen icon. Add the file and it is picked up automatically. |
| `og-image.png` | 1200×630 | Social share fallback. Per-page OG images are generated automatically at `/og`, so this is only a backstop — set `NEXT_PUBLIC_HAS_OG_IMAGE=true` to prefer it. |
| `portrait.jpg` | ≥800×800 | Your photograph on `/about`. Set `NEXT_PUBLIC_HAS_PORTRAIT=true` once added. |

## After replacing files

1. `NEXT_PUBLIC_HAS_CUSTOM_LOGO=true` in Vercel → Settings → Environment Variables
2. Redeploy (or just push — the pipeline redeploys on `main`)

That is the whole process. The favicon, the manifest, the OG images and the
header/footer marks all read from `src/lib/brand.ts`, which reads these files.

## Notes

- SVG is preferred for the logo and icon: it stays sharp on every display and
  costs almost nothing to download.
- The favicon must be legible at 16×16. Test it by shrinking it — if the detail
  disappears, simplify the mark rather than shipping mush.
- `og-image.png` should have the important content inside the central 1200×600,
  because some platforms crop the edges.
