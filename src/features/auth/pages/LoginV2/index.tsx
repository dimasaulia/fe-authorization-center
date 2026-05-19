import { LoginCarouselSection } from "./sections/LoginCarouselSection";
import { LoginFormSection } from "./sections/LoginFormSection";

export function LoginV2() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[linear-gradient(145deg,var(--auth-page-from)_0%,var(--auth-page-mid)_48%,var(--auth-page-to)_100%)] px-4 py-6 sm:px-8 lg:px-14 lg:py-8">
      <div className="flex min-h-[640px] w-full max-w-[1180px] overflow-hidden rounded-[28px] border border-[var(--auth-card-border)] bg-[var(--auth-card)] shadow-[0_24px_70px_var(--auth-shadow)] lg:h-[min(720px,calc(100vh-64px))] lg:min-h-[620px]">
        <LoginCarouselSection />
        <LoginFormSection />
      </div>
    </div>
  );
}
