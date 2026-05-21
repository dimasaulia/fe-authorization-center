"use client";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";

import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { Field } from "../../components/Field";
import { FormShell } from "../../components/FormShell";

export function TeamCreateV1() {
  const { t } = usePreferences();

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description={t("authz.teamCreate.description")}
        title={t("authz.teamCreate.title")}
      />
      <FormShell cancelHref={routes.teams} title={t("authz.teamCreate.formTitle")}>
        <Field label="Team Name" name="name" placeholder="Finance Team" required />
        <Field label="Team Code" name="code" placeholder="finance-team" required />
        <Field label="Organization" name="organization" placeholder="Internal Organization" required />
        <Field label="Status" name="status" options={["active", "inactive"]} type="select" />
        <Field label="Description" name="description" placeholder="Team responsibility" type="textarea" />
      </FormShell>
    </div>
  );
}
