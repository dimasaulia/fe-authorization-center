import { LoginCarouselSection } from "./sections/LoginCarouselSection";
import { LoginFormSection } from "./sections/LoginFormSection";

export function LoginV2() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[linear-gradient(145deg,#FFFFFF_0%,#F5F8FC_48%,#EEF4FB_100%)] px-4 py-6 sm:px-8 lg:px-14 lg:py-8">
      <div className="flex min-h-[640px] w-full max-w-[1180px] overflow-hidden rounded-[28px] border border-[#DDE3EA] bg-white shadow-[0_24px_70px_#2563EB1A] lg:h-[min(720px,calc(100vh-64px))] lg:min-h-[620px]">
        <LoginCarouselSection />
        <LoginFormSection />
      </div>
    </div>
  );
}
