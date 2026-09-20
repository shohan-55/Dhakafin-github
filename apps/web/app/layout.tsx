/**
 * Pass-through root layout.
 * ---------------------------------------------------------------------------
 * It renders nothing of its own — no `<html>`, no `<body>`. That is deliberate.
 *
 * Next.js requires a layout at the root of `app/` before a nested `not-found.tsx`
 * will render, but the `<html lang>` attribute must be per-locale, which the root
 * cannot know because it receives no route params. This file exists purely to
 * satisfy the first requirement without competing with `[locale]/layout.tsx` for
 * the second.
 *
 * Returning `children` directly (rather than wrapping them) is what allows
 * `app/[locale]/layout.tsx` to own the document. Without this file, an unmatched
 * URL renders Next.js's bare error document — no `lang`, no fonts, no header,
 * no way back into the site.
 *
 * Do not add `<html>` here. If you do, every page gets two of them.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
