const IST = "Asia/Kolkata";
const dateOnly = /^\d{4}-\d{2}-\d{2}$/;

const dayFormat = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: IST,
});
const shortDayFormat = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  timeZone: IST,
});
const timeFormat = new Intl.DateTimeFormat("en-IN", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: IST,
});

/** A calendar date ("2026-10-02") is formatted as-is, never shifted by a time zone. */
function toDate(value: string): Date {
  return dateOnly.test(value) ? new Date(`${value}T12:00:00+05:30`) : new Date(value);
}

/** "2 Oct 2026". Instants are shown in IST. Empty values show a dash. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "–";
  const date = toDate(value);
  return Number.isNaN(date.getTime()) ? "–" : dayFormat.format(date);
}

/** "2 Oct", for dense lists where the year is obvious. */
export function formatShortDate(value: string | null | undefined): string {
  if (!value) return "–";
  const date = toDate(value);
  return Number.isNaN(date.getTime()) ? "–" : shortDayFormat.format(date);
}

/** "3 Oct 2026, 2:12 pm IST". */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "–";
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return "–";
  return `${dayFormat.format(date)}, ${timeFormat.format(date)} IST`;
}
