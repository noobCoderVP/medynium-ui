import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./pagination";

const setup = (props: Partial<Parameters<typeof Pagination>[0]> = {}) => {
  const onOffsetChange = vi.fn();
  const onLimitChange = vi.fn();
  render(
    <Pagination
      noun="patients"
      total={120}
      offset={25}
      limit={25}
      onOffsetChange={onOffsetChange}
      onLimitChange={onLimitChange}
      {...props}
    />,
  );
  return { onOffsetChange, onLimitChange };
};

describe("Pagination", () => {
  it("reports the range over the whole filtered total", () => {
    setup();
    expect(screen.getByText("26 to 50 of 120 patients")).toBeInTheDocument();
    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
  });

  it("moves by page and jumps to the ends", async () => {
    const { onOffsetChange } = setup();
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onOffsetChange).toHaveBeenLastCalledWith(50);
    await userEvent.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onOffsetChange).toHaveBeenLastCalledWith(0);
    await userEvent.click(screen.getByRole("button", { name: "Last page" }));
    expect(onOffsetChange).toHaveBeenLastCalledWith(100);
    await userEvent.click(screen.getByRole("button", { name: "First page" }));
    expect(onOffsetChange).toHaveBeenLastCalledWith(0);
  });

  it("disables the buttons that would leave the range", () => {
    setup({ offset: 0 });
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "First page" })).toBeDisabled();
  });

  it("changes the page size", async () => {
    const { onLimitChange } = setup();
    await userEvent.selectOptions(screen.getByLabelText("Rows"), "50");
    expect(onLimitChange).toHaveBeenCalledWith(50);
  });

  it("shows only the count when everything fits on one page", () => {
    setup({ total: 7, offset: 0 });
    expect(screen.getByText("1 to 7 of 7 patients")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next page" })).not.toBeInTheDocument();
  });

  it("says so when there is nothing", () => {
    setup({ total: 0, offset: 0 });
    expect(screen.getByText("No patients")).toBeInTheDocument();
  });
});
