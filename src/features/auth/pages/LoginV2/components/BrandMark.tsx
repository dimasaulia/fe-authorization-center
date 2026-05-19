type BrandMarkProps = {
  name?: string;
};

export function BrandMark({ name = "Open Suite" }: BrandMarkProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[11px] border border-[var(--auth-field-border)] bg-[var(--auth-card)] shadow-[0_8px_22px_#0F172A0A]">
        <svg
          aria-hidden="true"
          className="h-[18px] w-[18px]"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 3L19.5 7.25V16.75L12 21L4.5 16.75V7.25L12 3Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M12 7.5L16 9.75V14.25L12 16.5L8 14.25V9.75L12 7.5Z"
            fill="currentColor"
            opacity="0.12"
          />
        </svg>
      </div>
      <span className="text-base font-semibold leading-5 text-[var(--auth-text)]">
        {name}
      </span>
    </div>
  );
}
