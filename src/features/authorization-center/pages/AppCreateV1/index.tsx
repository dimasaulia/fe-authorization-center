import { routes } from "@/config/routes.config";

import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { Field } from "../../components/Field";
import { FormShell } from "../../components/FormShell";
import { appTypes, statuses, teams } from "../../data/authorization-center.data";

export function AppCreateV1() {
  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description="Create an app identity that will become the permission prefix and credential boundary."
        title="Create App"
      />
      <FormShell cancelHref={routes.apps} title="App identity">
        <Field label="App Name" name="name" placeholder="Finance" required />
        <Field
          help="Must be unique and should not change after creation."
          label="App Code"
          name="code"
          placeholder="finance or asset-management"
          required
        />
        <Field label="App Type" name="type" options={appTypes} required type="select" />
        <Field label="Status" name="status" options={statuses} type="select" />
        <Field
          label="Owner Team"
          name="ownerTeam"
          options={teams.map((team) => team.name)}
          type="select"
        />
        <Field
          label="Description"
          name="description"
          placeholder="What this app is responsible for"
          type="textarea"
        />
      </FormShell>
    </div>
  );
}
