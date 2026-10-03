// X-3: checks every text/background token pair for WCAG AA (4.5:1 text, 3:1 UI boundaries) in both themes.
// Usage: node scripts/check-contrast.mjs   (exits 1 when a pair fails)
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const block = (selector) => {
  const start = css.indexOf(`${selector} {`);
  return css.slice(start, css.indexOf("\n}", start));
};
const tokens = (selector) =>
  Object.fromEntries(
    [...block(selector).matchAll(/--([\w-]+):\s*oklch\(([^)]+)\)/g)].map(([, name, value]) => [
      name,
      value,
    ]),
  );

function oklchToLinear(value) {
  const [l, c, h] = value.split("/")[0].trim().split(/\s+/).map(Number);
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
  return rgb.map((x) => Math.min(1, Math.max(0, x)));
}
const luminance = (v) => {
  const [r, g, b] = oklchToLinear(v);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const textPairs = [
  ["foreground", "background"],
  ["foreground", "card"],
  ["muted-foreground", "background"],
  ["muted-foreground", "card"],
  ["muted-foreground", "muted"],
  ["primary-foreground", "primary"],
  ["primary", "background"],
  ["primary", "card"],
  ["destructive", "card"],
  ["accent-foreground", "accent"],
  ["sidebar-foreground", "sidebar"],
  ["sidebar-muted", "sidebar"],
  ["sidebar-accent-foreground", "sidebar-accent"],
  ["sidebar-primary", "sidebar"],
  ...["agent", "fact", "source", "synth", "warn", "crit", "ok"].flatMap((role) => [
    [role, `${role}-soft`],
    [role, "card"],
  ]),
];
const uiPairs = [
  ["input", "card"],
  ["ring", "card"],
];

let failed = 0;
for (const [name, selector] of [
  ["light", ":root"],
  ["dark", ".dark"],
]) {
  const t = tokens(selector);
  const check = (pairs, min) => {
    for (const [fg, bg] of pairs) {
      const r = ratio(t[fg], t[bg]);
      const ok = r >= min;
      if (!ok) failed += 1;
      console.log(
        `${ok ? "ok  " : "FAIL"} ${name.padEnd(5)} ${fg} on ${bg}: ${r.toFixed(2)} (min ${min})`,
      );
    }
  };
  check(textPairs, 4.5);
  check(uiPairs, 3);
}
process.exit(failed ? 1 : 0);
