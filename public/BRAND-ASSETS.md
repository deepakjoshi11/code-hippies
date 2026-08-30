# Brand assets

The real marks are committed. This documents what each one is and where it is
used, so a future change does not put the wrong mark in the wrong place.

## Two marks, deliberately different

There are two identities on this site and they are not interchangeable:

- **The Deepak Joshi portrait** is the *site logo* — header and footer. Its
  `alt` text is `"Deepak Joshi — founder of Code Hippies"`, which is the only
  place the founder's name appears in the header markup now that it is out of
  the wordmark. That alt text is doing real SEO work; it is also an accurate
  description of the image, which is why it is legitimate rather than stuffing.
  Do not change it to "logo" or "Code Hippies".

- **The Code Hippies monkey mark** is the *brand icon* — favicon, iOS icon and
  the social share card. Here the studio is what should be recognised in a tab
  strip or a shared link, not a face.

## Files

| File | Size | Used for |
| --- | --- | --- |
| `logo.png` | 512×512 | Large form of the site logo. Circular, transparent corners. |
| `logo-mark.png` | 256×256 | Header and footer mark. What `Logo` actually renders. |
| `og-image.png` | 1200×630 | Social share card — the monkey mark centred on black. Per-page OG images are generated at `/og`; this is the fallback. |
| `src/app/icon.png` | 512×512 | Favicon. Next serves this automatically from the app directory. |
| `src/app/apple-icon.png` | 180×180 | iOS home screen. Opaque on purpose — iOS renders alpha as black and applies its own corner mask. |
| `portrait.jpg` | ≥800×800 | Not yet supplied. Photograph for `/about`; set `NEXT_PUBLIC_HAS_PORTRAIT=true` once added. |

All the PNGs above are circular with transparent corners, so no mark carries a
black square into a light theme.

## Flags

`NEXT_PUBLIC_HAS_CUSTOM_LOGO` and `NEXT_PUBLIC_HAS_OG_IMAGE` now default to
**on**, because the real files are committed. They exist only to force the
generated placeholders back, by setting them to the string `"false"`.

## Regenerating

The committed PNGs were derived from the supplied source images with `sharp`:
resized, masked to a circle so the corners are transparent, then
palette-quantised — these are flat-shaded illustrations, so 256 colours is
lossless to the eye and cut the favicon from 288 KB to 64 KB.

If you replace a source image, keep the circular mask and re-quantise. A
full-colour 1024×1024 PNG as a favicon is a real cost on first paint.

## Notes

- The favicon must stay legible at 16×16. Shrink it and look: if the laptop and
  glasses turn to mush, simplify the mark rather than shipping it.
- `og-image.png` keeps its subject inside the central 1200×600, because some
  platforms crop the edges.
