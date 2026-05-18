import { Can } from "@/modules/auth/components/Can";
import { users } from "./constants/users.constant";

export function UserListV1() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-accent">UserListV1</p>
          <h2 className="mt-2 text-3xl font-semibold">User management</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            A lightweight page to verify feature routing, table composition, and
            permission-based commands.
          </p>
        </div>
        <Can permission="user.create">
          <button className="h-10 rounded-md bg-accent px-4 text-sm font-semibold text-accent-foreground">
            Create user
          </button>
        </Can>
      </section>
      <section className="overflow-hidden rounded-lg border border-line bg-panel">
        <div className="grid grid-cols-[1fr_160px_160px] border-b border-line px-4 py-3 text-sm font-semibold text-muted">
          <span>Name</span>
          <span>Role</span>
          <span>Status</span>
        </div>
        {users.map((user) => (
          <div
            className="grid grid-cols-[1fr_160px_160px] border-b border-line px-4 py-4 text-sm last:border-b-0"
            key={user.email}
          >
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="mt-1 text-muted">{user.email}</p>
            </div>
            <span>{user.role}</span>
            <span className="text-accent">{user.status}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
