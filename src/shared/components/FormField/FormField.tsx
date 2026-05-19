type FormFieldProps = {
  autoComplete?: string;
  defaultValue?: string;
  id: string;
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
};

export function FormField({
  autoComplete,
  defaultValue,
  id,
  label,
  name,
  placeholder,
  type = "text",
}: FormFieldProps) {
  return (
    <label className="flex flex-col gap-[7px]" htmlFor={id}>
      <span className="text-[13px] font-medium leading-4 text-[var(--auth-muted-strong)]">
        {label}
      </span>
      <input
        autoComplete={autoComplete}
        className="h-[46px] rounded-xl border border-[var(--auth-field-border)] bg-[var(--auth-field)] px-3.5 text-sm leading-[18px] text-[var(--auth-text)] outline-none transition placeholder:text-[var(--auth-subtle)] focus:border-hero focus:bg-[var(--auth-card)] focus:ring-4 focus:ring-[#356FB91A]"
        defaultValue={defaultValue}
        id={id}
        name={name}
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}
