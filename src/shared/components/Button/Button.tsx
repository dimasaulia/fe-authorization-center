import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  href?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
};

const variants = {
  primary:
    "border border-hero-border bg-hero text-hero-foreground hover:bg-hero-hover",
  secondary: "border border-line bg-panel text-foreground hover:bg-[#f1eadf]",
  outline:
    "border border-[var(--auth-field-border)] bg-[var(--auth-card)] text-[var(--auth-text)] hover:bg-[var(--auth-field)]",
};

export function Button({
  children,
  className = "",
  fullWidth = false,
  href,
  type = "button",
  variant = "primary",
}: ButtonProps) {
  const buttonClassName = [
    "inline-flex h-[46px] items-center justify-center rounded-xl px-4 text-sm font-semibold transition",
    fullWidth ? "w-full" : "",
    variants[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link className={buttonClassName} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClassName} type={type}>
      {children}
    </button>
  );
}
