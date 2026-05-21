"use client";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";

import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { Field } from "../../components/Field";
import { FormShell } from "../../components/FormShell";

export function ActionCreateV1() {
  const { t } = usePreferences();

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description={t("authz.actionCreate.description")}
        title={t("authz.actionCreate.title")}
      />
      <FormShell cancelHref={routes.actions} title={t("authz.actionCreate.formTitle")}>
        <Field label="Action Name" name="name" placeholder="Approve" required />
        <Field
          help="Must be globally unique and lowercase."
          label="Action Code"
          name="code"
          placeholder="approve"
          required
        />
        <Field
          label="Action Type"
          name="type"
          options={["read", "write", "approval", "export", "admin", "system"]}
          required
          type="select"
        />
        <Field
          label="Risk Level"
          name="riskLevel"
          options={["low", "medium", "high", "critical"]}
          required
          type="select"
        />
        <Field label="Status" name="status" options={["active", "inactive"]} type="select" />
        <Field label="Is System Action" name="isSystem" options={["false", "true"]} type="select" />
        <Field
          label="Description"
          name="description"
          placeholder="What this action allows"
          type="textarea"
        />
      </FormShell>
    </div>
  );
}
