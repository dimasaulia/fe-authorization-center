import type { AppStatus } from "../data/authorization-center.data";

type StatusBadgeProps = {
  status: AppStatus;
};

const statusClassName: Record<AppStatus, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  inactive: "border-slate-200 bg-slate-50 text-slate-600",
  revoked: "border-red-200 bg-red-50 text-red-700",
  suspended: "border-amber-200 bg-amber-50 text-amber-700",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-semibold capitalize ${statusClassName[status]}`}
    >
      {status}
    </span>
  );
}
