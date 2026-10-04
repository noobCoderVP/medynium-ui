import type { DocTable as DocTableData } from "../types";

/** A plain comparison table: a header row on the app's table colours, and a scroll area on narrow screens. */
export function DocTable({ table, label }: { table: DocTableData; label: string }) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className="mt-6 overflow-x-auto rounded-xl border border-border bg-card shadow-sm"
    >
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <thead className="bg-table-head text-table-head-foreground">
          <tr>
            {table.columns.map((column) => (
              <th key={column} scope="col" className="px-4 py-2.5 text-xs font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {table.rows.map((row) => (
            <tr key={row[0]} className="align-top">
              {row.map((cell, index) =>
                index === 0 ? (
                  <th
                    key={cell}
                    scope="row"
                    className="w-44 px-4 py-3 font-semibold text-foreground"
                  >
                    {cell}
                  </th>
                ) : (
                  <td key={cell} className="px-4 py-3 leading-relaxed text-muted-foreground">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
