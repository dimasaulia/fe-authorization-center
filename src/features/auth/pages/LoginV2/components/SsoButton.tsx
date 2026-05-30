import { Button } from "@/shared/components/Button";

type SsoButtonProps = {
  label: string;
  onClick?: () => void;
};

export function SsoButton({ label, onClick }: SsoButtonProps) {
  return (
    <Button className="gap-2.5 font-medium" fullWidth onClick={onClick} variant="outline">
      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[var(--auth-field-border)] text-xs font-bold leading-4 text-hero">
        G
      </span>
      {label}
    </Button>
  );
}
