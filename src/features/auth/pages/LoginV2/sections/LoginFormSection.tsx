"use client";

import { usePreferences } from "@/modules/preferences";
import { Button } from "@/shared/components/Button";
import { Divider } from "@/shared/components/Divider";
import { FormField } from "@/shared/components/FormField";
import { LanguageToggle } from "@/shared/components/LanguageToggle";
import { ThemeToggle } from "@/shared/components/ThemeToggle";

import { SsoButton } from "../components/SsoButton";
import { loginV2Fields } from "../constants/login-fields.constant";

export function LoginFormSection() {
  const { t } = usePreferences();

  return (
    <section className="relative flex h-full flex-1 flex-col justify-center bg-[var(--auth-card)] px-6 py-10 sm:px-12 lg:px-16 lg:py-14">
      <div className="absolute right-6 top-6 flex flex-wrap justify-end gap-2 sm:right-8 lg:right-10 lg:top-8">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="mx-auto flex w-full max-w-[420px] flex-col gap-7">
        <header className="flex flex-col gap-2.5 pt-10 sm:pt-0">
          <p className="text-sm font-medium leading-[18px] text-[var(--auth-muted)]">
            {t("login.workspace")}
          </p>
          <h1 className="text-[34px] font-semibold leading-[1.12] text-hero">
            {t("login.title")}
          </h1>
          <p className="text-[15px] leading-[1.5] text-[var(--auth-muted)]">
            {t("login.subtitle")}
          </p>
        </header>

        <form className="flex flex-col gap-3" method="POST">
          {loginV2Fields.map((field) => (
            <FormField
              autoComplete={field.autoComplete}
              defaultValue={field.defaultValue}
              id={`login-v2-${field.name}`}
              key={field.name}
              label={t(field.labelKey)}
              name={field.name}
              placeholder={t(field.placeholderKey)}
              type={field.type}
            />
          ))}
          <Button fullWidth type="submit">
            {t("login.submit")}
          </Button>
        </form>

        <Divider label={t("login.divider")} />
        <SsoButton label={t("login.sso")} />

        <div className="flex items-center gap-2">
          <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[var(--auth-success)]" />
          <p className="text-xs leading-4 text-[var(--auth-subtle)]">
            {t("login.protected")}
          </p>
        </div>
      </div>
    </section>
  );
}
