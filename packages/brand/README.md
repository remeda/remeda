# Remeda brand assets

The remeda mark: the TypeScript layer peeled back over the JavaScript layer,
with one R printed through both in perfect registration - white where it
sits on the type layer, ink where it sits on the runtime layer. Remeda's
types and runtime are the same library; peel one away and the other is
exactly underneath.

## Files

| File                                    | Use                                                                                        |
| --------------------------------------- | ------------------------------------------------------------------------------------------ |
| `remeda-mark.svg`                       | The mark. Full-bleed 512 tile; also serves as the favicon.                                 |
| `remeda-mark-mono.svg`                  | Two-tone monochrome (blue+ink flattened to dark, yellow+white to light).                   |
| `remeda-mark-mono-transparent.svg`      | One color, one path; light areas are transparent. For stamps, embroidery, terminal badges. |
| `remeda-lockup-light.svg` / `-dark.svg` | Mark + "remeda" wordmark, for light and dark surfaces.                                     |
| `generate.cjs`                          | Regenerates the five SVGs from first principles and pixel-verifies them.                   |
| `generate-assets.cjs`                   | Renders every surface asset (favicons, OG images, avatars) from the SVGs.                  |

## Specification

- Tile: 512x512, sharp corners. TypeScript blue `#3178C6` over JavaScript
  yellow `#F7DF1E`; letter white `#FFFFFF` / ink `#1c1f26`.
- Seam: straight cut from (446,0) to (286,512), passing just inside the
  bowl's inner corner so the letter splits at its natural joint - white
  stem, ink body - with no trapped slivers (solver-verified).
- Letter: "R", Sora ExtraBold (800), bbox height ~250, tucked to
  (right=490, bottom=486). Wordmark: "remeda" in the same Sora 800.
- Monochrome rule: blue+ink flatten to one color, yellow+white to the
  other. The counterchange guarantees local contrast, so the mono marks
  keep both the letter and the layer story.

## Updating surfaces

```bash
npm run generate -w @remeda/brand # regenerate + verify the SVGs (only needed if the spec changes)
npm run assets -w @remeda/brand   # render all surface assets
```

| Surface                    | Asset                                                                       | How it updates                                                             |
| -------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Docs favicon               | `packages/docs/public/favicon.svg`, `favicon.ico`, `apple-touch-icon.png`   | `generate-assets.cjs` writes them; linked from `src/layouts/base.astro`.   |
| Docs / link-preview image  | `packages/docs/public/og.png`                                               | `generate-assets.cjs`; referenced by `og:image` in `base.astro`.           |
| GitHub org avatar          | `packages/brand/dist/github-avatar.png` (or `-padded.png` for circle crops) | Manual upload: github.com organization settings.                           |
| GitHub repo social preview | `packages/brand/dist/github-social-preview.png`                             | Manual upload: repository Settings > Social preview.                       |
| README hero (GitHub + npm) | `packages/brand/remeda-lockup-{light,dark}.svg`                             | Referenced by absolute raw.githubusercontent.com URLs from both READMEs.   |
| npm                        | -                                                                           | npm has no logo field; the README hero is the npm surface.                 |
| JSR                        | -                                                                           | JSR scopes show the linked GitHub org avatar; updates with the org upload. |
| StackBlitz template        | -                                                                           | No avatar surface.                                                         |

## Licensing

The letterforms are outlines of [Sora](https://github.com/sora-xor/sora-font)
(SIL Open Font License; `fonts/OFL.txt`). The remeda code is MIT; the logo
identifies the remeda project - please don't use it to imply endorsement or
affiliation.

## History

The previous mark (the "bridge") is preserved in repository history: it was
archived under `packages/brand/archive-bridge/` by the commit that introduced
this package and removed in the commit that adopted the peel. `git log --all
--full-history -- packages/brand/archive-bridge` finds it.
