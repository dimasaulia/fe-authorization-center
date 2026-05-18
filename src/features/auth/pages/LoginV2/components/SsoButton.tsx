import { Button } from "@/shared/components/Button";

export function SsoButton() {
  return (
    <Button className="gap-2.5 font-medium" fullWidth variant="outline">
      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#DCE3EC] text-xs font-bold leading-4 text-[#2563EB]">
        G
      </span>
      Continue with SSO
    </Button>
  );
}
