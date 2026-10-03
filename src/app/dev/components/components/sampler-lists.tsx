"use client";

import { useState } from "react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { DateField, FilterField, ListToolbar } from "@/components/shared/list-toolbar";
import { Pagination } from "@/components/shared/pagination";
import type { SortOrder } from "@/lib/use-list-state";

interface Row {
  id: string;
  name: string;
  condition: string;
  age: number;
  status: string;
}

const ALL: Row[] = Array.from({ length: 64 }, (_, i) => ({
  id: `P-${1000 + i}`,
  name: ["Asha Rao", "Vikram Shah", "Meera Iyer", "Rahul Patel"][i % 4] + ` ${i + 1}`,
  condition: ["Type 2 diabetes", "Hypertension and chronic kidney disease", "Asthma"][i % 3],
  age: 30 + (i % 50),
  status: i % 5 === 0 ? "Review" : "Stable",
}));

const columns: Column<Row>[] = [
  { key: "name", header: "Patient", sortKey: "name", cell: (r) => r.name },
  { key: "age", header: "Age", sortKey: "age", cell: (r) => r.age },
  { key: "condition", header: "Main diagnosis", cell: (r) => r.condition },
  { key: "status", header: "Status", cell: (r) => r.status },
];

/** The list pattern every data screen uses: toolbar, server-style sort, table (cards on phones), pagination. */
export function SamplerLists() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState({ key: "name", order: "asc" as SortOrder });
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

  const rows = ALL.filter(
    (r) =>
      (!status || r.status === status) && r.name.toLowerCase().includes(text.trim().toLowerCase()),
  ).sort((a, b) => {
    const x = a[sort.key as "name" | "age"];
    const y = b[sort.key as "name" | "age"];
    return (x < y ? -1 : x > y ? 1 : 0) * (sort.order === "asc" ? 1 : -1);
  });
  const page = rows.slice(offset, offset + limit);

  return (
    <div className="space-y-3">
      <ListToolbar
        search={{ value: text, onChange: setText, label: "Search patients" }}
        sort={{
          options: [
            { key: "name", label: "Name" },
            { key: "age", label: "Age" },
          ],
          value: sort.key,
          order: sort.order,
          onChange: (key, order) => setSort({ key, order }),
        }}
        activeCount={(text ? 1 : 0) + (status ? 1 : 0)}
        onClear={() => {
          setText("");
          setStatus("");
        }}
      >
        <FilterField
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "Review", label: "Review" },
            { value: "Stable", label: "Stable" },
          ]}
        />
        <DateField label="From" value="" onChange={() => undefined} />
      </ListToolbar>
      <DataTable
        caption="Sample list"
        columns={columns}
        rows={page}
        rowKey={(r) => r.id}
        sort={sort}
        onSort={(key) =>
          setSort((s) => ({
            key,
            order: s.key === key && s.order === "asc" ? "desc" : "asc",
          }))
        }
      />
      <Pagination
        noun="patients"
        total={rows.length}
        offset={offset}
        limit={limit}
        onOffsetChange={setOffset}
        onLimitChange={(n) => {
          setLimit(n);
          setOffset(0);
        }}
      />
    </div>
  );
}
