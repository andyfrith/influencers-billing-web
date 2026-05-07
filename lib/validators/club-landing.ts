import { z } from "zod";

import { COLOR_THEME_IDS, type ColorThemeId } from "@/lib/color-themes";
import {
  DEFAULT_LANDING_SECTION_ORDER,
  DEFAULT_LANDING_SECTION_VISIBILITY,
} from "@/data/club-landing-types";

const colorThemeIdSchema = z
  .string()
  .refine((value): value is ColorThemeId => (COLOR_THEME_IDS as readonly string[]).includes(value), {
    message: "Unknown color theme id.",
  });

const ctaItemSchema = z.object({
  label: z.string().trim().min(1).max(200),
  href: z.string().trim().min(1).max(4000),
});

const imageRefSchema = z.object({
  src: z.string().trim().min(1).max(8000),
  alt: z.string().trim().min(1).max(500),
});

const joinFormSchema = z.object({
  headline: z.string().trim().min(1).max(300),
  subheadline: z.string().trim().min(1).max(800),
  submitButtonLabel: z.string().trim().min(1).max(120),
});

export const joinContentSchema = z.object({
  headline: z.string().trim().min(1).max(300),
  preHeadline: z.string().trim().min(1).max(200),
  subheadline: z.string().trim().min(1).max(800),
  form: joinFormSchema,
});

export const loginContentSchema = z.object({
  headline: z.string().trim().min(1).max(300),
  preHeadline: z.string().trim().min(1).max(200),
  subheadline: z.string().trim().min(1).max(800),
  form: joinFormSchema,
});

export const heroContentSchema = z.object({
  headline: z.string().trim().min(1).max(300),
  subheadline: z.string().trim().min(1).max(2000),
  tagline: z.string().trim().min(1).max(200),
  backgroundImage: imageRefSchema,
  cta: z.object({
    items: z.array(ctaItemSchema).min(1).max(10),
  }),
});

export const benefitsItemSchema = z.object({
  icon: z.string().trim().min(1).max(80),
  image: imageRefSchema,
  headline: z.string().trim().min(1).max(300),
  subheadline: z.string().trim().min(1).max(1200),
});

export const benefitsContentSchema = z.object({
  headline: z.string().trim().min(1).max(300),
  subheadline: z.string().trim().min(1).max(2000),
  items: z.array(benefitsItemSchema).min(1).max(24),
});

export const exploreItemSchema = z.object({
  headline: z.string().trim().min(1).max(300),
  preHeadline: z.string().trim().min(1).max(200),
  subheadline: z.string().trim().min(1).max(1200).optional(),
  image: imageRefSchema,
  href: z.string().trim().min(1).max(4000),
});

export const exploreContentSchema = z.object({
  headline: z.string().trim().min(1).max(300),
  subheadline: z.string().trim().min(1).max(2000),
  cta: z.object({
    label: z.string().trim().min(1).max(200),
    href: z.string().trim().min(1).max(4000),
  }),
  items: z.array(exploreItemSchema).min(1).max(48),
});

export const attentionContentSchema = z.object({
  headline: z.string().trim().min(1).max(300),
  subheadline: z.string().trim().min(1).max(2000),
  cta: z.object({
    items: z.array(ctaItemSchema).min(1).max(10),
  }),
});

export const landingSectionVisibilitySchema = z
  .object({
    hero: z.boolean(),
    benefits: z.boolean(),
    explore: z.boolean(),
    attention: z.boolean(),
  })
  .default(DEFAULT_LANDING_SECTION_VISIBILITY);

export const landingSectionOrderSchema = z
  .array(z.enum(["hero", "benefits", "explore", "attention"]))
  .length(4)
  .refine((value) => new Set(value).size === value.length, "Section order must not contain duplicates.")
  .default(DEFAULT_LANDING_SECTION_ORDER);

/**
 * Validates JSON stored in `clubs.landing_content` before save or after load.
 */
export const clubLandingStoragePayloadSchema = z.object({
  name: z.string().trim().min(1).max(200),
  colorThemeId: colorThemeIdSchema,
  sections: landingSectionVisibilitySchema.optional(),
  sectionOrder: landingSectionOrderSchema.optional(),
  join: joinContentSchema.optional(),
  login: loginContentSchema.optional(),
  hero: heroContentSchema,
  benefits: benefitsContentSchema,
  explore: exploreContentSchema,
  attention: attentionContentSchema,
});

export type ClubLandingStoragePayloadInput = z.infer<typeof clubLandingStoragePayloadSchema>;
