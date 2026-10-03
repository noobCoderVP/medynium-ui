const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Amounts arrive as { amount, currency: "INR" }; shown as ₹1,23,456. */
export function formatMoney(money: { amount: number } | null | undefined): string {
  return money ? inr.format(money.amount) : "–";
}
