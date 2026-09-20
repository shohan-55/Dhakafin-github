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
| `dhakafin-currency-bn-400.woff2` | 400 | 0.5 KB | **yes** — preloaded, see below |
| `dhakafin-currency-bn-600.woff2` | 600 | 0.5 KB | **yes** — preloaded, see below |
| `jetbrains-mono-latin-wght-normal.woff2` | 100–800 var | 39.5 KB | on first use (SRO refs, code) |
| `hind-siliguri-bengali-400-normal.woff2` | 400 | 69.4 KB | **only if Bengali text is on the page** |
| `hind-siliguri-bengali-600-normal.woff2` | 600 | 73.0 KB | **only if Bengali text is on the page** |

Budget: **180 KB** (`font.budgetKB` in `df.tokens.json`), enforced by `scripts/check-font-budget.mjs`.

## The taka-sign problem

`৳` is **U+09F3** — it sits inside the Bengali block, but it appears constantly in *English* prose (`৳12.5 L`). No Latin font we ship carries it. So the browser resolved it through the Bengali face and downloaded **139 KB of Bengali typography to draw one currency symbol**.

Measured by the budget gate, on the home page, before the fix:

```
▣ fetched 73.0 KB hind_siliguri_bengali_600
▣ fetched 69.4 KB hind_siliguri_bengali_400
   → 230.4 KB  (128% of budget) — FAILED
```

The fix is two-part, and both halves are required:

1. The Bengali `unicode-range` is split around the currency signs — `U+0980-09F1,U+09F4-09FE`, dropping `U+09F2-09F3` and `U+20B9`.
2. A dedicated 960-byte face covers exactly those three codepoints, and sits *before* the Bengali fallback in every stack in `globals.css`.

A Latin page now pays **≈50 KB** for fonts. A Bengali page pays for real Bengali typography, which is the correct trade.

Two weights exist so that `৳` is never synthetic-bolded next to a 700-weight metric numeral; the browser picks the nearer face with no synthesis.

## Regenerating the currency subset

Only needed if the currency glyphs or the source weight change. Requires `fonttools` + `brotli`:

```bash
pip install --break-system-packages fonttools brotli
```

```bash
cd <repo root>
for w in 400 600; do
  python3 -m fontTools.subset \
    node_modules/@fontsource/hind-siliguri/files/hind-siliguri-bengali-${w}-normal.woff2 \
    --output-file=apps/web/app/fonts/dhakafin-currency-bn-${w}.woff2 \
    --unicodes=U+09F2,U+09F3,U+20B9 \
    --layout-features= --no-hinting --desubroutinize --flavor=woff2 \
    --drop-tables+=GSUB,GPOS,GDEF,DSIG --name-IDs=1,2 --recalc-bounds
done
```

`--layout-features=` is deliberate: a currency sign is a single glyph run and needs no shaping tables. Dropping them is most of the size reduction.

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
