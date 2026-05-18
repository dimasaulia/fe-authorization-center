"use client";

import { useState } from "react";

import { BrandMark } from "../components/BrandMark";
import { CarouselControl } from "../components/CarouselControl";
import { loginCarouselSlides } from "../constants/login-carousel.constant";

export function LoginCarouselSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = loginCarouselSlides[activeIndex];

  function goToPreviousSlide() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? loginCarouselSlides.length - 1 : currentIndex - 1,
    );
  }

  function goToNextSlide() {
    setActiveIndex((currentIndex) =>
      currentIndex === loginCarouselSlides.length - 1 ? 0 : currentIndex + 1,
    );
  }

  return (
    <section className="hidden h-full w-[52%] flex-col gap-8 overflow-hidden border-r border-[#E6EAF0] bg-white px-9 py-9 lg:flex">
      <BrandMark />

      <div
        className="relative min-h-0 flex-1 overflow-hidden rounded-[28px] border border-[#FFFFFF75] shadow-[0_22px_58px_#2563EB33]"
        style={{
          backgroundImage:
            "radial-gradient(circle farthest-corner at 18% 16%, #F1FBFF 0%, #C9EEFBF0 24%, #5AABF0D1 52%, #2C73D1E0 78%, #164C93 100%)",
        }}
      >
        <div className="absolute -left-[90px] -top-[26px] h-[370px] w-[370px] rounded-full bg-[#FFFFFF42] blur-xl" />
        <div className="absolute -right-[92px] top-[42px] h-[360px] w-[360px] rounded-full bg-[#5EC6FF4D]" />
        <div className="absolute left-9 top-[38px] h-[5px] w-[5px] rounded-full bg-[#FFFFFF6B]" />
        <div className="absolute right-[86px] top-[166px] h-1 w-1 rounded-full bg-[#FFFFFF57]" />

        <div className="absolute bottom-[252px] left-8 flex gap-2.5">
          {activeSlide.tags.map((tag) => (
            <span
              className="flex h-[34px] items-center rounded-[10px] border border-[#FFFFFF66] bg-[#082C6038] px-[13px] text-xs font-semibold leading-4 text-white"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="absolute bottom-16 left-8 right-8 flex min-h-[132px] flex-col justify-between rounded-[22px] border border-[#FFFFFF7A] bg-[#082C603D] px-[22px] py-5 shadow-[0_18px_48px_#082C602E]">
          <h2 className="max-w-[390px] text-2xl font-semibold leading-[1.18] text-white">
            {activeSlide.title}
          </h2>
          <div className="mt-[22px] flex flex-col gap-[3px]">
            <p className="text-[13px] font-semibold leading-4 text-white">
              {activeSlide.badge}
            </p>
            <p className="text-xs leading-4 text-[#FFFFFFC7]">
              {activeSlide.description}
            </p>
          </div>
        </div>

        <div className="absolute bottom-[18px] right-6 flex gap-2.5">
          <CarouselControl
            direction="previous"
            label="Previous login banner"
            onClick={goToPreviousSlide}
          />
          <CarouselControl
            direction="next"
            label="Next login banner"
            onClick={goToNextSlide}
          />
        </div>
      </div>
    </section>
  );
}
