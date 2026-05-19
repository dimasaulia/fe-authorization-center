type DividerProps = {
  label?: string;
};

export function Divider({ label }: DividerProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-[var(--auth-divider)]" />
      {label ? (
        <span className="text-xs leading-4 text-[var(--auth-subtle)]">
          {label}
        </span>
      ) : null}
      <div className="h-px flex-1 bg-[var(--auth-divider)]" />
    </div>
  );
}
