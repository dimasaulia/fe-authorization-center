import { Button } from "@/shared/components/Button";
import { Divider } from "@/shared/components/Divider";
import { FormField } from "@/shared/components/FormField";

import { SsoButton } from "../components/SsoButton";
import { loginV2Fields } from "../constants/login-fields.constant";

export function LoginFormSection() {
  return (
    <section className="flex h-full flex-1 flex-col justify-center bg-white px-6 py-10 sm:px-12 lg:px-16 lg:py-14">
      <div className="mx-auto flex w-full max-w-[420px] flex-col gap-7">
        <header className="flex flex-col gap-2.5">
          <p className="text-sm font-medium leading-[18px] text-[#667085]">
            Workspace IDCH
          </p>
          <h1 className="text-[34px] font-semibold leading-[1.12] text-[#356FB9]">
            Sign in to Open Suite
          </h1>
          <p className="text-[15px] leading-[1.5] text-[#667085]">
            Use your workspace account to continue.
          </p>
        </header>

        <form className="flex flex-col gap-3" method="POST">
          {loginV2Fields.map((field) => (
            <FormField
              autoComplete={field.autoComplete}
              defaultValue={field.defaultValue}
              id={`login-v2-${field.name}`}
              key={field.name}
              label={field.label}
              name={field.name}
              placeholder={field.placeholder}
              type={field.type}
            />
          ))}
          <Button fullWidth type="submit">
            Login
          </Button>
        </form>

        <Divider label="or" />
        <SsoButton />

        <div className="flex items-center gap-2">
          <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#10B981]" />
          <p className="text-xs leading-4 text-[#7A8494]">
            Protected by Open Suite SSO and network policy.
          </p>
        </div>
      </div>
    </section>
  );
}
