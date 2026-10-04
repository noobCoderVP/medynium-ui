import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Markdown } from "./markdown";

describe("Markdown", () => {
  it("renders headings, bullets, bold and italics as elements", () => {
    const { container } = render(
      <Markdown
        text={
          "## Recent results\n- **eGFR 42 (low)** on 18 Sep\n- Potassium *4.9*\n\nA plain paragraph."
        }
      />,
    );
    expect(screen.getByRole("heading", { name: "Recent results" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(container.querySelector("strong")?.textContent).toBe("eGFR 42 (low)");
    expect(container.querySelector("em")?.textContent).toBe("4.9");
    expect(screen.getByText("A plain paragraph.")).toBeInTheDocument();
  });

  it("never turns text into markup", () => {
    const { container } = render(
      <Markdown text={"- <img src=x onerror=alert(1)> and <b>bold</b>"} />,
    );
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("b")).toBeNull();
    expect(screen.getByRole("listitem").textContent).toContain("<img src=x onerror=alert(1)>");
  });

  it("starts a new list after a heading and keeps separate lists apart", () => {
    const { container } = render(<Markdown text={"## A\n- one\n## B\n- two"} />);
    expect(container.querySelectorAll("ul")).toHaveLength(2);
  });
});
