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
      <span className="text-[13px] font-medium leading-4 text-[#475467]">
        {label}
      </span>
      <input
        autoComplete={autoComplete}
        className="h-[46px] rounded-xl border border-[#DCE3EC] bg-[#FAFBFC] px-3.5 text-sm leading-[18px] text-[#111318] outline-none transition placeholder:text-[#98A2B3] focus:border-[#356FB9] focus:bg-white focus:ring-4 focus:ring-[#356FB91A]"
        defaultValue={defaultValue}
        id={id}
        name={name}
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}
