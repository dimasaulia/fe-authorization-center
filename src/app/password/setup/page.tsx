import { Suspense } from "react";

import { PasswordSetupV1 } from "@/features/auth/pages/PasswordSetupV1";

export default function PasswordSetupPage() {
  return (
    <Suspense>
      <PasswordSetupV1 />
    </Suspense>
  );
}
