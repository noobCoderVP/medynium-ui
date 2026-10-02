import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SyntheticBanner } from "./synthetic-banner";

describe("SyntheticBanner", () => {
  it("states that data is synthetic and the output is decision support", () => {
    render(<SyntheticBanner />);
    expect(screen.getByRole("note")).toHaveTextContent(/synthetic data/i);
    expect(screen.getByRole("note")).toHaveTextContent(/decision support/i);
  });
});
