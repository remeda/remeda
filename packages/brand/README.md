# Remeda brand assets

The remeda mark: the TypeScript layer peeled back over the JavaScript layer,
with one R printed through both in perfect registration - white where it
sits on the type layer, ink where it sits on the runtime layer. Remeda's
types and runtime are the same library; peel one away and the other is
exactly underneath.

## Design

Every concrete value - the tile size, the colors, the seam endpoints, the
glyph and font, the lockup spacing - lives in
[`scripts/spec.ts`](scripts/spec.ts). That file is the single source of truth;
this section describes the decisions behind those numbers, not the numbers
themselves. To change how the mark looks, edit `spec.ts` and regenerate.

- **Two layers, one letter.** The tile is TypeScript blue over JavaScript
  yellow. A single "R" is printed through both in perfect registration: white
  where it sits on the type layer, ink where it sits on the runtime layer.
- **The seam.** A straight diagonal cut runs from the top edge to the bottom
  edge, passing just inside the bowl's inner corner so the letter splits at its
  natural joint - white stem, ink body - with no trapped slivers. The generator
  solves for this and pixel-verifies it.
- **Counterchange.** Blue+ink flatten to one tone, yellow+white to the other.
  Because the letter is always the opposite tone of the layer behind it, local
  contrast survives flattening, so the monochrome marks keep both the letter and
  the layer story.
- **Type.** The mark letter and the wordmark share one typeface, Sora (see
  [Licensing](#licensing)).

## Files

| File                                           | Use                                                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `scripts/spec.ts`                              | The logo definition: every dimension, color, and coordinate. Edit here to change the mark. |
| `assets/remeda-mark.svg`                       | The mark. Full-bleed tile; also serves as the favicon.                                     |
| `assets/remeda-mark-mono.svg`                  | Two-tone monochrome (blue+ink flattened to dark, yellow+white to light).                   |
| `assets/remeda-mark-mono-transparent.svg`      | One color, one path; light areas are transparent. For stamps, embroidery, terminal badges. |
| `assets/remeda-lockup-light.svg` / `-dark.svg` | Mark + wordmark, for light and dark surfaces.                                              |
| `scripts/generate.ts`                          | Regenerates the SVGs from `spec.ts` and pixel-verifies them.                               |
| `scripts/generate-assets.ts`                   | Renders every surface asset (favicons, OG images, avatars) from the SVGs.                  |

## Updating surfaces

```bash
npm run generate -w @remeda/brand # regenerate + verify the SVGs (only needed if the spec changes)
npm run assets -w @remeda/brand   # render all surface assets
```

| Surface                    | Asset                                                                       | How it updates                                                                  |
| -------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Docs favicon               | `packages/docs/public/favicon.svg`, `favicon.ico`, `apple-touch-icon.png`   | `scripts/generate-assets.ts` writes them; linked from `src/layouts/base.astro`. |
| Docs / link-preview image  | `packages/docs/public/og.png`                                               | `scripts/generate-assets.ts`; referenced by `og:image` in `base.astro`.         |
| GitHub org avatar          | `packages/brand/dist/github-avatar.png` (or `-padded.png` for circle crops) | Manual upload: github.com organization settings.                                |
| GitHub repo social preview | `packages/brand/dist/github-social-preview.png`                             | Manual upload: repository Settings > Social preview.                            |
| README hero (GitHub + npm) | `packages/brand/assets/remeda-lockup-{light,dark}.svg`                      | Referenced by absolute raw.githubusercontent.com URLs from both READMEs.        |
| npm                        | -                                                                           | npm has no logo field; the README hero is the npm surface.                      |
| JSR                        | -                                                                           | JSR scopes show the linked GitHub org avatar; updates with the org upload.      |
| StackBlitz template        | -                                                                           | No avatar surface.                                                              |

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
