import type { ColorThemeId } from "@/lib/color-themes";

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

export type ClubLandingContent = {
  id: number;
  name: string;
  /** Named color theme (`html[data-color-theme]`) for this club’s discover landing. */
  colorThemeId: ColorThemeId;
  hero: HeroContent;
  benefits: BenefitsContent;
  explore: ExploreContent;
  attention: AttentionContent;
};
