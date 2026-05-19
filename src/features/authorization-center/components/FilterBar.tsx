type FilterBarProps = {
  searchPlaceholder: string;
  secondaryFilterLabel?: string;
  secondaryFilterOptions?: string[];
};

export function FilterBar({
  searchPlaceholder,
  secondaryFilterLabel = "Type",
  secondaryFilterOptions = [],
}: FilterBarProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-4 md:grid-cols-[1fr_180px_180px]">
      <input
        className="h-11 rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)]"
        placeholder={searchPlaceholder}
        type="search"
      />
      <select className="h-11 rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none focus:border-[var(--dashboard-accent-border)]">
        <option>All statuses</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>
      {secondaryFilterOptions.length > 0 ? (
        <select className="h-11 rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none focus:border-[var(--dashboard-accent-border)]">
          <option>All {secondaryFilterLabel.toLowerCase()}</option>
          {secondaryFilterOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : null}
    </div>
  );
}
