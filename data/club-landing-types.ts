import type { ColorThemeId } from "@/lib/color-themes";

export type JoinContent = {
  headline: string;
  preHeadline: string;
  subheadline: string;
  form: {
    headline: string;
    subheadline: string;
    submitButtonLabel: string;
  };
};

export type LoginContent = {
  headline: string;
  preHeadline: string;
  subheadline: string;
  form: {
    headline: string;
    subheadline: string;
    submitButtonLabel: string;
  };
};

export type HeroContent = {
  headline: string;
  subheadline: string;
  tagline: string;
  backgroundImage: {
    src: string;
    alt: string;
  };
  cta: {
    items: {
      label: string;
      href: string;
    }[];
  };
};

export type AttentionContent = {
  headline: string;
  subheadline: string;
  cta: {
    items: {
      label: string;
      href: string;
    }[];
  };
};

export type BenefitsContent = {
  headline: string;
  subheadline: string;
  items: BenefitsItemContent[];
};

export type BenefitsItemContent = {
  icon: string;
  image: {
    src: string;
    alt: string;
  };
  headline: string;
  subheadline: string;
};

export type ExploreContent = {
  headline: string;
  subheadline: string;
  cta: {
    label: string;
    href: string;
  };
  items: ExploreItemContent[];
};

export type ExploreItemContent = {
  headline: string;
  preHeadline: string;
  subheadline?: string;
  image: {
    src: string;
    alt: string;
  };
  href: string;
};

export type LandingSectionVisibility = {
  hero: boolean;
  benefits: boolean;
  explore: boolean;
  attention: boolean;
};

export type LandingSectionKey = keyof LandingSectionVisibility;

export const DEFAULT_LANDING_SECTION_VISIBILITY: LandingSectionVisibility = {
  hero: true,
  benefits: true,
  explore: true,
  attention: true,
};

export const DEFAULT_LANDING_SECTION_ORDER: LandingSectionKey[] = [
  "hero",
  "benefits",
  "explore",
  "attention",
];

export type ClubLandingContent = {
  id: number;
  name: string;
  colorThemeId: ColorThemeId;
  sections?: LandingSectionVisibility;
  sectionOrder?: LandingSectionKey[];
  join?: JoinContent;
  login?: LoginContent;
  hero: HeroContent;
  benefits: BenefitsContent;
  explore: ExploreContent;
  attention: AttentionContent;
};

/** Payload persisted in the database `clubs.landing_content` column (numeric `id` is client-only). */
export type ClubLandingStoragePayload = Omit<ClubLandingContent, "id">;
