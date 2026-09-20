# `apps/web/app/fonts/`

Self-hosted font binaries for DhakaFin. These are **committed assets**, not build output — the build is hermetic and cannot fail on a font CDN outage.

## Why self-hosted rather than `next/font/google`

| | `next/font/google` | self-hosted here |
|---|---|---|
| First paint | DNS + TLS + RTT to `fonts.gstatic.com` | same origin, already warm |
| CI / air-gapped builds | fails if Google is unreachable | hermetic |
| Visitor IP disclosure | sent to a third party | none |
| Font files under version control | no | yes — changes are reviewable |

Next.js still fingerprints every file, injects `size-adjust` fallback metrics (so the system-font fallback occupies identical space → no layout shift), and emits `font-display: swap`.

## What ships, and what it costs

| File | Weight | Size | Loaded on an English page? |
|---|---|---|---|
| `plus-jakarta-sans-latin-wght-normal.woff2` | 200–800 var | 26.7 KB | **yes** — preloaded, primary UI face |
| `space-grotesk-latin-wght-normal.woff2` | 300–700 var | 21.8 KB | **yes** — preloaded, financial figures |
| `dhakafin-ui-bn-400.woff2` | 400 | 0.7 KB | **yes** — preloaded, see below |
| `dhakafin-ui-bn-600.woff2` | 600 | 0.7 KB | **yes** — preloaded, see below |
| `jetbrains-mono-latin-wght-normal.woff2` | 100–800 var | 39.5 KB | on first use (SRO refs, code) |
| `hind-siliguri-bengali-400-normal.woff2` | 400 | 69.4 KB | **only if Bengali text is on the page** |
| `hind-siliguri-bengali-600-normal.woff2` | 600 | 73.0 KB | **only if Bengali text is on the page** |

Budget: **180 KB** (`font.budgetKB` in `df.tokens.json`), enforced by `scripts/check-font-budget.mjs`.

## Bengali glyphs in Latin UI — the 139 KB mistake, twice

Two things are written in Bengali script but belong on the *English* page:

- **৳ (U+09F3)** — the taka sign, which appears constantly in English prose (`৳12.5 L`)
- **বাংলা** — the language switcher's own label

No Latin face we ship carries either. Without a dedicated face, the browser
resolved them through the full Bengali font.

Measured on the English home page, before the fix:

```
▣ 73.0 KB  hind_siliguri_bengali_600
▣ 69.4 KB  hind_siliguri_bengali_400
▣ 39.5 KB  jetbrains_mono_latin
▣ 26.7 KB  plus_jakarta_sans_latin
▣ 21.8 KB  space_grotesk_latin
   → 230.4 KB  (128% of budget) — FAILED
```

139 KB of Bengali typography to draw a currency symbol and a two-word link —
**58% of the page's entire font payload.**

The fix is a 1.5 KB pyftsubset pair covering exactly those glyphs, listed
*before* the Bengali face in every stack in `globals.css`. The browser uses the
first family that covers a codepoint, so these resolve to the subset and the
Bengali font is never requested on an English page.

| | Before | After |
|---|---|---|
| English page | 118.8 KB | **49.9 KB** |
| Bengali page | 118.8 KB | 119.3 KB |

The Bengali page is unchanged in substance — it always needed the real typeface.
The English page got 58% lighter, and the headroom that buys belongs to Phase 2.

**Adding a glyph is a one-line change.** Add the codepoint to `--unicodes` below
and to the `unicode-range` in `fonts.ts`. No change to the Bengali face is
needed, because the subset is ordered ahead of it — there is no range to carve
out and therefore no way to break the Bengali page by editing the subset.

## Regenerating the subset

Only needed if the glyph set or the source weight changes. Requires `fonttools` + `brotli`:

```bash
pip install --break-system-packages fonttools brotli
```

```bash
cd <repo root>
UNICODES='U+0982,U+09AC,U+09B2,U+09BE,U+09F2,U+09F3,U+20B9'
for w in 400 600; do
  python3 -m fontTools.subset \
    node_modules/@fontsource/hind-siliguri/files/hind-siliguri-bengali-${w}-normal.woff2 \
    --output-file=apps/web/app/fonts/dhakafin-ui-bn-${w}.woff2 \
    --unicodes=${UNICODES} \
    --layout-features= --no-hinting --desubroutinize --flavor=woff2 \
    --drop-tables+=GSUB,GPOS,GDEF,DSIG --name-IDs=1,2 --recalc-bounds
done
```

`--layout-features=` is deliberate: these are isolated glyph runs and need no
shaping tables. Dropping them is most of the size reduction. (The full Bengali
face keeps its shaping tables — conjuncts depend on them.)

Then update the `unicode-range` in `fonts.ts` to match `--unicodes`.

## Updating the full fonts

Binaries come from the Fontsource npm packages, which are already in `apps/web/package.json` as dependencies — fonts are a runtime asset with a version, not a hand-copied file.

```bash
cp node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2 \
   node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2 \
   node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2 \
   node_modules/@fontsource/hind-siliguri/files/hind-siliguri-bengali-400-normal.woff2 \
   node_modules/@fontsource/hind-siliguri/files/hind-siliguri-bengali-600-normal.woff2 \
   apps/web/app/fonts/
npm run build && node scripts/check-font-budget.mjs
```

**Always re-run the budget gate after touching fonts.** Adding one `preload: true` to a Bengali face would silently add 139 KB to every English page — the gate is the only thing that notices.

## Not yet shipped

`font.serif` (`Newsreader`) is declared in the token file for Phase 2 long-form editorial templates. It is intentionally absent here: no Phase 1 page uses it, and shipping an unused 30 KB face would be dead weight. Add it with `@fontsource-variable/newsreader` when the editorial templates land.
