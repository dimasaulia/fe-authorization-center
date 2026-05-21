export type DataTableColumn<T> = {
  key: string;
  label: string;
  width?: string;
  render: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  emptyMessage?: string;
  isLoading?: boolean;
  minWidth?: string;
  rows: T[];
  title: string;
  getRowKey: (row: T) => string;
};

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <div className="flex items-center gap-4 border-b border-[var(--dashboard-border-soft)] px-5 py-4 last:border-b-0">
      {Array.from({ length: cols }).map((_, i) => (
        <div
          className="h-4 flex-1 animate-pulse rounded-md bg-[var(--dashboard-panel-subtle)]"
          key={i}
          style={{ maxWidth: i === 0 ? "160px" : i === cols - 1 ? "120px" : undefined }}
        />
      ))}
    </div>
  );
}

export function DataTable<T>({
  columns,
  emptyMessage = "No data found.",
  isLoading = false,
  minWidth = "700px",
  rows,
  title,
  getRowKey,
}: DataTableProps<T>) {
  const gridCols = columns.map((col) => col.width ?? "1fr").join(" ");

  return (
    <section className="overflow-hidden rounded-2xl">
      {/* Gradient header band */}
      <div className="bg-[var(--dashboard-access-header)] px-5 pb-3 pt-4">
        <h2 className="text-sm font-semibold text-[var(--dashboard-text)]">
          {title}
        </h2>
      </div>

      {/* Table container sits slightly overlapping the gradient */}
      <div className="-mt-1 overflow-x-auto rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] shadow-[0_1px_3px_var(--dashboard-shadow)]">
        <div style={{ minWidth }}>
          {/* Header row */}
          <div
            className="grid border-b border-[var(--dashboard-border-soft)] px-5 py-3"
            style={{ gridTemplateColumns: gridCols }}
          >
            {columns.map((col) => (
              <span
                className="text-xs font-semibold uppercase tracking-[0.04em] text-[var(--dashboard-muted)]"
                key={col.key}
              >
                {col.label}
              </span>
            ))}
          </div>

          {/* Loading state */}
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRow cols={columns.length} key={i} />
            ))}

          {/* Empty state */}
          {!isLoading && rows.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-[var(--dashboard-muted)]">
              {emptyMessage}
            </div>
          )}

          {/* Data rows */}
          {!isLoading &&
            rows.map((row) => (
              <div
                className="grid items-center border-b border-[var(--dashboard-border-soft)] px-5 py-4 text-sm transition hover:bg-[var(--dashboard-panel-subtle)] last:border-b-0"
                key={getRowKey(row)}
                style={{ gridTemplateColumns: gridCols }}
              >
                {columns.map((col) => (
                  <div key={col.key}>{col.render(row)}</div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
