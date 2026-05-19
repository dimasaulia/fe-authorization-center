"use client";

import { useState } from "react";

import { routes } from "@/config/routes.config";
import { Button } from "@/shared/components/Button";

import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { Field } from "../../components/Field";
import {
  credentialScopes,
  environments,
  getAuthorizationApp,
} from "../../data/authorization-center.data";

type AppCredentialCreateV1Props = {
  appId: string;
};

export function AppCredentialCreateV1({ appId }: AppCredentialCreateV1Props) {
  const app = getAuthorizationApp(appId);
  const [showSecret, setShowSecret] = useState(false);
  const secret = "openauth_live_7n2q9v_example_secret_once";

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description="Create a credential for a specific app environment. The generated raw secret is only shown once."
        title="Create Credential"
      />
      <form
        className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-5"
        onSubmit={(event) => {
          event.preventDefault();
          setShowSecret(true);
        }}
      >
        <h2 className="text-lg font-semibold text-[var(--dashboard-text)]">
          Credential details
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field
            label="Credential Name"
            name="name"
            placeholder={`${app.code}-api-production`}
            required
          />
          <Field label="Environment" name="environment" options={environments} required type="select" />
          <Field
            help="Auto-suggest from app code and environment."
            label="Client ID / App ID"
            name="clientId"
            placeholder={`${app.code}-api-production`}
            required
          />
          <Field
            label="Credential Type"
            name="credentialType"
            options={["keycloak_client_credentials", "api_key", "service_account"]}
            required
            type="select"
          />
          <Field label="Status" name="status" options={["active", "inactive"]} type="select" />
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--dashboard-muted-strong)] md:col-span-2">
            Allowed Scopes *
            <select
              className="min-h-28 rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 py-3 text-sm text-[var(--dashboard-text)] outline-none focus:border-[var(--dashboard-accent-border)]"
              multiple
              name="scopes"
              required
            >
              {credentialScopes.map((scope) => (
                <option key={scope} value={scope}>
                  {scope}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button href={routes.appCredentials(app.id)} variant="secondary">
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>

      {showSecret ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
          <h2 className="text-lg font-semibold">Secret shown once</h2>
          <p className="mt-2 text-sm leading-6">
            Store this secret now. It should be persisted only as a hash/reference and will not be shown again after this panel is closed.
          </p>
          <pre className="mt-4 overflow-auto rounded-xl bg-white p-4 text-sm">
{`OPENAUTH_APP_ID=${app.code}-api-production
OPENAUTH_CLIENT_SECRET=${secret}
OPENAUTH_AUTH_URL=https://keycloak.example.com
OPENAUTH_AUTHZ_URL=https://authz.example.com`}
          </pre>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="h-10 rounded-xl bg-amber-900 px-4 text-sm font-semibold text-white" type="button">
              Copy Secret
            </button>
            <button className="h-10 rounded-xl border border-amber-300 bg-white px-4 text-sm font-semibold" type="button">
              Download .env snippet
            </button>
            <Button href={routes.appCredentials(app.id)}>Done</Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
