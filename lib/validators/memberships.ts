import { z } from "zod";

import { clubLandingStoragePayloadSchema } from "@/lib/validators/club-landing";

export const createClubSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug must use lowercase letters, numbers, and hyphens."),
  description: z.string().trim().min(10).max(1000),
  contextMarkdown: z.string().trim().min(20).max(30000),
});

export const createClubPlanSchema = z.object({
  name: z.string().trim().min(2).max(120),
  interval: z.enum(["month", "year"]),
  amountCents: z.number().int().positive(),
  currency: z.string().trim().toLowerCase().length(3).default("usd"),
});

export const subscribeToClubSchema = z.object({
  planId: z.string().uuid(),
});

export const createCancellationRequestSchema = z.object({
  reason: z.string().trim().min(5).max(500),
});

export const resolveCancellationRequestSchema = z.object({
  action: z.enum(["approve", "reject", "complete"]),
});

export const updateClubStatusSchema = z.object({
  status: z.enum(["new", "active", "archived"]),
});

export const updateClubPlanStatusSchema = z.object({
  isActive: z.boolean(),
});

export const promoteAdminSchema = z.object({
  email: z.string().trim().email(),
  bootstrapKey: z.string().min(1),
});

export const updateClubLandingBodySchema = z.object({
  /** Set to `null` to clear stored content and fall back to static defaults. */
  landingContent: clubLandingStoragePayloadSchema.nullable(),
});

export const createClubLandingVariationSchema = z.object({
  key: z
    .string()
    .trim()
    .toLowerCase()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  displayName: z.string().trim().min(2).max(120),
});

export const createClubLandingRevisionSchema = z.object({
  variationId: z.string().uuid(),
  landingContent: clubLandingStoragePayloadSchema,
  note: z.string().trim().max(500).optional(),
  publish: z.boolean().optional(),
});

export const publishClubLandingSchema = z.object({
  variationId: z.string().uuid(),
  revisionId: z.string().uuid(),
});
