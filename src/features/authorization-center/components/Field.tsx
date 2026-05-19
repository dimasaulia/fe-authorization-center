type FieldProps = {
  help?: string;
  label: string;
  name: string;
  options?: string[];
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  type?: "input" | "select" | "textarea";
};

export function Field({
  help,
  label,
  name,
  options = [],
  placeholder,
  readOnly = false,
  required = false,
  type = "input",
}: FieldProps) {
  const labelText = `${label}${required ? " *" : ""}`;
  const inputClassName =
    "min-h-11 rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[var(--dashboard-muted-strong)]">
      {labelText}
      {type === "select" ? (
        <select className={inputClassName} name={name} required={required}>
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          className={`${inputClassName} min-h-28 py-3`}
          name={name}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
        />
      ) : (
        <input
          className={inputClassName}
          name={name}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
        />
      )}
      {help ? <span className="text-xs text-[var(--dashboard-subtle)]">{help}</span> : null}
    </label>
  );
}
