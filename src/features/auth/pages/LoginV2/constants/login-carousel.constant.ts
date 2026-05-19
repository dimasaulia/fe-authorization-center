import type { TranslationKey } from "@/modules/preferences";

type LoginCarouselSlide = {
  badgeKey: TranslationKey;
  descriptionKey: TranslationKey;
  tagKeys: ReadonlyArray<TranslationKey>;
  titleKey: TranslationKey;
};

export const loginCarouselSlides = [
  {
    badgeKey: "login.carousel.slide1.badge",
    descriptionKey: "login.carousel.slide1.description",
    tagKeys: ["login.carousel.slide1.tag1", "login.carousel.slide1.tag2"],
    titleKey: "login.carousel.slide1.title",
  },
  {
    badgeKey: "login.carousel.slide2.badge",
    descriptionKey: "login.carousel.slide2.description",
    tagKeys: ["login.carousel.slide2.tag1", "login.carousel.slide2.tag2"],
    titleKey: "login.carousel.slide2.title",
  },
  {
    badgeKey: "login.carousel.slide3.badge",
    descriptionKey: "login.carousel.slide3.description",
    tagKeys: [
      "login.carousel.slide3.tag1",
      "login.carousel.slide3.tag2",
      "login.carousel.slide3.tag3",
    ],
    titleKey: "login.carousel.slide3.title",
  },
] as const satisfies ReadonlyArray<LoginCarouselSlide>;
