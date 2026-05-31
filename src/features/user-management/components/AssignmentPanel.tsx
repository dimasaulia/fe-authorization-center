"use client";

type AssignmentPanelProps<T> = {
  title: string;
  availableTitle: string;
  assignedTitle: string;
  availableItems: T[];
  assignedItems: T[];
  search: string;
  searchPlaceholder: string;
  isLoading: boolean;
  dragHint: string;
  draggingItem: T | null;
  getItemId: (item: T) => number;
  getItemLabel: (item: T) => string;
  getItemCode: (item: T) => string;
  getItemSublabel: (item: T) => string;
  onSearch: (q: string) => void;
  onAssign: (item: T) => void;
  onUnassign: (item: T) => void;
  onDragStart: (item: T) => void;
  onDragEnd: () => void;
  onDropToAssigned: () => void;
  onDropToAvailable: () => void;
};

export function AssignmentPanel<T>({
  title,
  availableTitle,
  assignedTitle,
  availableItems,
  assignedItems,
  search,
  searchPlaceholder,
  isLoading,
  dragHint,
  draggingItem,
  getItemId,
  getItemLabel,
  getItemCode,
  getItemSublabel,
  onSearch,
  onAssign,
  onUnassign,
  onDragStart,
  onDragEnd,
  onDropToAssigned,
  onDropToAvailable,
}: AssignmentPanelProps<T>) {
  return (
    <div className="space-y-4 rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-6">
      <h2 className="text-sm font-semibold text-[var(--dashboard-text)]">{title}</h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--dashboard-muted)]">{availableTitle}</span>
            {draggingItem && (
              <span className="text-xs text-[var(--dashboard-muted)]">{dragHint}</span>
            )}
          </div>

          <input
            className="h-9 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            type="search"
            value={search}
          />

          <div
            className="min-h-40 space-y-1 rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] p-2"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropToAvailable}
          >
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--dashboard-accent)] border-t-transparent" />
              </div>
            )}
            {!isLoading && availableItems.length === 0 && (
              <p className="py-4 text-center text-xs text-[var(--dashboard-muted)]">-</p>
            )}
            {!isLoading && availableItems.map((item) => (
              <button
                className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-[var(--dashboard-panel)] px-3 py-2 text-left transition hover:border-[var(--dashboard-accent-border)] hover:bg-[var(--dashboard-accent-soft)]"
                draggable
                key={getItemId(item)}
                onClick={() => onAssign(item)}
                onDragEnd={onDragEnd}
                onDragStart={() => onDragStart(item)}
                type="button"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[var(--dashboard-text)]">{getItemLabel(item)}</p>
                  <p className="truncate font-mono text-[10px] text-[var(--dashboard-muted)]">{getItemCode(item)}</p>
                </div>
                <span className="ml-2 inline-flex shrink-0 items-center rounded border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--dashboard-muted-strong)]">
                  {getItemSublabel(item)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--dashboard-muted)]">{assignedTitle}</span>
            {assignedItems.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-[var(--dashboard-accent-soft)] px-2 py-0.5 text-[10px] font-bold text-[var(--dashboard-accent)]">
                {assignedItems.length}
              </span>
            )}
          </div>

          <div className="h-9" />

          <div
            className={`min-h-40 space-y-1 rounded-xl border p-2 transition ${draggingItem ? "border-[var(--dashboard-accent-border)] bg-[var(--dashboard-accent-soft)]" : "border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)]"}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropToAssigned}
          >
            {assignedItems.length === 0 && (
              <p className="py-4 text-center text-xs text-[var(--dashboard-muted)]">-</p>
            )}
            {assignedItems.map((item) => (
              <button
                className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-[var(--dashboard-accent-border)] bg-[var(--dashboard-panel)] px-3 py-2 text-left transition hover:border-red-300 hover:bg-red-50"
                key={getItemId(item)}
                onClick={() => onUnassign(item)}
                type="button"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[var(--dashboard-text)]">{getItemLabel(item)}</p>
                  <p className="truncate font-mono text-[10px] text-[var(--dashboard-muted)]">{getItemCode(item)}</p>
                </div>
                <span className="ml-2 shrink-0 text-[10px] font-semibold text-red-500">x</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
