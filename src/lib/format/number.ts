const numberFormat = new Intl.NumberFormat("en-IN");
const valueFormat = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

/** Indian digit grouping: 1,23,456. */
export function formatNumber(value: number | null | undefined): string {
  return value === null || value === undefined ? "–" : numberFormat.format(value);
}

/** Lab values keep their own precision, trimmed to at most 2 decimals. */
export function formatValue(value: number | null | undefined, unit?: string | null): string {
  if (value === null || value === undefined) return "–";
  const text = valueFormat.format(value);
  return unit ? `${text} ${unit}` : text;
}
