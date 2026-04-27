import { z } from "zod";

export const createClubSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug must use lowercase letters, numbers, and hyphens."),
  description: z.string().trim().min(10).max(1000),
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
  status: z.enum(["active", "archived"]),
});

export const updateClubPlanStatusSchema = z.object({
  isActive: z.boolean(),
});

export const promoteAdminSchema = z.object({
  email: z.string().trim().email(),
  bootstrapKey: z.string().min(1),
});
