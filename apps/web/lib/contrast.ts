/**
 * Client-side WCAG contrast maths.
 * Mirrors packages/tokens/validate.mjs so the design-system gallery can display
 * live-measured ratios from the actual token values — if a token changes, the
 * gallery numbers change with it and can never drift from the CI contract.
 */

function srgbToLinear(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}

export function parseColour(input: string): { r: number; g: number; b: number; a: number } {
  const value = input.trim();

  if (value.startsWith('rgb')) {
    const nums = value.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
    return { r: nums[0] ?? 0, g: nums[1] ?? 0, b: nums[2] ?? 0, a: nums[3] ?? 1 };
  }

  let hex = value.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  if (hex.length === 8) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: parseInt(hex.slice(6, 8), 16) / 255,
    };
  }

  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
    a: 1,
  };
}

function composite(fg: { r: number; g: number; b: number; a: number }, bg: { r: number; g: number; b: number }): { r: number; g: number; b: number } {
  if (fg.a >= 1) return { r: fg.r, g: fg.g, b: fg.b };
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
  };
}

function luminance({ r, g, b }: { r: number; g: number; b: number }): number {
  return 0.2126 * srgbToLinear(r / 255) + 0.7152 * srgbToLinear(g / 255) + 0.0722 * srgbToLinear(b / 255);
}

/** WCAG 2.x contrast ratio between a foreground (alpha-composited) and a background. */
export function contrastRatio(fg: string, bg: string): number {
  const bgParsed = parseColour(bg);
  const fgParsed = composite(parseColour(fg), bgParsed);
  const [lighter, darker] = [luminance(fgParsed), luminance(bgParsed)].sort((a, b) => b - a) as [number, number];
  return (lighter + 0.05) / (darker + 0.05);
}

export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

export function contrastVerdict(ratio: number, level: 'normal' | 'large' = 'normal'): 'AAA' | 'AA' | 'large-only' | 'fail' {
  const min = level === 'large' ? 3 : 4.5;
  if (ratio >= 7 && min <= 4.5) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'large-only';
  return 'fail';
}
