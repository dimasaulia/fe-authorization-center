type CarouselControlProps = {
  direction: "previous" | "next";
  label: string;
  onClick: () => void;
};

export function CarouselControl({
  direction,
  label,
  onClick,
}: CarouselControlProps) {
  const path =
    direction === "previous" ? "M15 6L9 12L15 18" : "M9 6L15 12L9 18";

  return (
    <button
      aria-label={label}
      className="flex h-[50px] w-[54px] items-center justify-center rounded-2xl border border-[#FFFFFFB3] bg-[#FFFFFFEB] text-black shadow-[0_10px_24px_#0F172A14] transition hover:bg-white"
      onClick={onClick}
      type="button"
    >
      <svg
        aria-hidden="true"
        className="h-[19px] w-[19px]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d={path}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.9"
        />
      </svg>
    </button>
  );
}
