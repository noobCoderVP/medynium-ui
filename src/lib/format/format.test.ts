import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime, formatMoney, formatNumber, formatValue } from ".";

describe("date formatting (IST, en-IN)", () => {
  it("does not shift a calendar date", () => {
    expect(formatDate("2026-10-02")).toBe("2 Oct 2026");
  });
  it("shows instants in IST", () => {
    expect(formatDateTime("2026-10-03T08:42:11Z")).toBe("3 Oct 2026, 2:12 pm IST");
  });
  it("shows a dash for missing or invalid values", () => {
    expect(formatDate(null)).toBe("–");
    expect(formatDate("not a date")).toBe("–");
  });
});

describe("number and money formatting", () => {
  it("groups digits the Indian way", () => {
    expect(formatNumber(1234567)).toBe("12,34,567");
  });
  it("formats INR", () => {
    expect(formatMoney({ amount: 123456 })).toBe("₹1,23,456");
  });
  it("keeps lab precision and appends the unit", () => {
    expect(formatValue(42.5, "mL/min/1.73 m²")).toBe("42.5 mL/min/1.73 m²");
    expect(formatValue(null)).toBe("–");
  });
});
