import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataTable, type Column } from "./data-table";

interface Row {
  id: string;
  name: string;
  age: number;
}
const rows: Row[] = [
  { id: "1", name: "Bela", age: 40 },
  { id: "2", name: "Asha", age: 60 },
];
const columns: Column<Row>[] = [
  { key: "name", header: "Name", sortValue: (r) => r.name, cell: (r) => r.name },
  { key: "age", header: "Age", sortValue: (r) => r.age, cell: (r) => r.age },
  { key: "plain", header: "Plain", cell: () => "x" },
];

const names = () =>
  within(screen.getAllByRole("rowgroup")[1])
    .getAllByRole("row")
    .map((r) => r.textContent?.slice(0, 4));

describe("DataTable", () => {
  it("is a named table with column headers", () => {
    render(<DataTable caption="People" columns={columns} rows={rows} rowKey={(r) => r.id} />);
    expect(screen.getByRole("table", { name: "People" })).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(3);
  });

  it("sorts from a header button and reports aria-sort", async () => {
    render(<DataTable caption="People" columns={columns} rows={rows} rowKey={(r) => r.id} />);
    expect(names()).toEqual(["Bela", "Asha"]);
    await userEvent.click(screen.getByRole("button", { name: /name/i }));
    expect(names()).toEqual(["Asha", "Bela"]);
    expect(screen.getByRole("columnheader", { name: /name/i })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
    await userEvent.click(screen.getByRole("button", { name: /name/i }));
    expect(names()).toEqual(["Bela", "Asha"]);
    expect(screen.getByRole("columnheader", { name: /name/i })).toHaveAttribute(
      "aria-sort",
      "descending",
    );
  });

  it("does not offer a sort button on a column without a sort value", () => {
    render(<DataTable caption="People" columns={columns} rows={rows} rowKey={(r) => r.id} />);
    expect(screen.queryByRole("button", { name: /plain/i })).not.toBeInTheDocument();
  });

  it("marks the highlighted row as current", () => {
    render(
      <DataTable
        caption="People"
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        highlightKey="2"
      />,
    );
    expect(screen.getByRole("row", { name: /asha/i })).toHaveAttribute("aria-current", "true");
  });

  it("in server mode shows the API order, sorts through onSort and marks the active column", async () => {
    const onSort = vi.fn();
    const serverColumns: Column<Row>[] = [
      { key: "name", header: "Name", sortKey: "name", cell: (r) => r.name },
      { key: "age", header: "Age", sortKey: "age", cell: (r) => r.age },
      { key: "plain", header: "Plain", cell: () => "x" },
    ];
    render(
      <DataTable
        caption="People"
        columns={serverColumns}
        rows={rows}
        rowKey={(r) => r.id}
        sort={{ key: "age", order: "desc" }}
        onSort={onSort}
      />,
    );
    expect(names()).toEqual(["Bela", "Asha"]);
    expect(screen.getByRole("columnheader", { name: /age/i })).toHaveAttribute(
      "aria-sort",
      "descending",
    );
    await userEvent.click(screen.getByRole("button", { name: /name/i }));
    expect(onSort).toHaveBeenCalledWith("name");
    expect(names()).toEqual(["Bela", "Asha"]);
    expect(screen.queryByRole("button", { name: /plain/i })).not.toBeInTheDocument();
  });
});
