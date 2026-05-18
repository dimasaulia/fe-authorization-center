type DividerProps = {
  label?: string;
};

export function Divider({ label }: DividerProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-[#E6EAF0]" />
      {label ? (
        <span className="text-xs leading-4 text-[#8A94A6]">{label}</span>
      ) : null}
      <div className="h-px flex-1 bg-[#E6EAF0]" />
    </div>
  );
}
