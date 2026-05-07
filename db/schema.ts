import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import type { ClubLandingStoragePayload } from "@/data/club-landing-types";

export const userRoleEnum = pgEnum("user_role", ["member", "admin"]);
export const clubStatusEnum = pgEnum("club_status", ["new", "active", "archived"]);
export const planIntervalEnum = pgEnum("plan_interval", ["month", "year"]);
export const membershipStatusEnum = pgEnum("membership_status", [
  "active",
  "incomplete",
  "past_due",
  "canceled",
  "unpaid",
]);
export const cancellationRequestStatusEnum = pgEnum("cancellation_request_status", [
  "requested",
  "approved",
  "rejected",
  "completed",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").default("member").notNull(),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailUniqueIdx: uniqueIndex("users_email_unique_idx").on(table.email),
  }),
);

export const emailVerificationTokens = pgTable(
  "email_verification_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tokenHashUniqueIdx: uniqueIndex("email_verification_token_hash_unique_idx").on(
      table.tokenHash,
    ),
  }),
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tokenHashUniqueIdx: uniqueIndex("password_reset_token_hash_unique_idx").on(
      table.tokenHash,
    ),
  }),
);

export const billingCustomers = pgTable(
  "billing_customers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    stripeCustomerId: text("stripe_customer_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userUniqueIdx: uniqueIndex("billing_customers_user_unique_idx").on(table.userId),
    stripeCustomerUniqueIdx: uniqueIndex("billing_customers_stripe_customer_unique_idx").on(
      table.stripeCustomerId,
    ),
  }),
);

export const clubs = pgTable(
  "clubs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    /** Markdown brief describing purpose/context for design and content generation. */
    contextMarkdown: text("context_markdown").notNull().default(""),
    /** @deprecated Prefer {@link clubLandingRevisions}; kept for migration / fallback reads. */
    landingContent: jsonb("landing_content").$type<ClubLandingStoragePayload | null>(),
    /** Which variation is public for `/discover` (FK added in SQL migration to avoid circular schema refs). */
    publishedLandingVariationId: uuid("published_landing_variation_id"),
    /** Exact revision served publicly (FK added in SQL migration). */
    publishedLandingRevisionId: uuid("published_landing_revision_id"),
    status: clubStatusEnum("status").default("new").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugUniqueIdx: uniqueIndex("clubs_slug_unique_idx").on(table.slug),
  }),
);

/**
 * Named landing variants per club (e.g. default vs seasonal).
 */
export const clubLandingVariations = pgTable(
  "club_landing_variations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clubId: uuid("club_id")
      .notNull()
      .references(() => clubs.id, { onDelete: "cascade" }),
    /** Stable slug segment unique per club (e.g. `default`, `holiday-2026`). */
    key: text("key").notNull(),
    displayName: text("display_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    clubKeyUniqueIdx: uniqueIndex("club_landing_variations_club_key_unique_idx").on(
      table.clubId,
      table.key,
    ),
  }),
);

/**
 * Append-only history of landing JSON per variation.
 */
export const clubLandingRevisions = pgTable(
  "club_landing_revisions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    variationId: uuid("variation_id")
      .notNull()
      .references(() => clubLandingVariations.id, { onDelete: "cascade" }),
    landingContent: jsonb("landing_content").$type<ClubLandingStoragePayload>().notNull(),
    /** Optional label shown in admin history (e.g. “Publish”, “WIP”). */
    note: text("note"),
    createdByUserId: uuid("created_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
);

export const clubSubscriptionPlans = pgTable(
  "club_subscription_plans",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clubId: uuid("club_id")
      .notNull()
      .references(() => clubs.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    interval: planIntervalEnum("interval").notNull(),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").notNull().default("usd"),
    stripePriceId: text("stripe_price_id").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    stripePriceUniqueIdx: uniqueIndex("club_plans_stripe_price_unique_idx").on(
      table.stripePriceId,
    ),
  }),
);

export const clubMemberships = pgTable(
  "club_memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clubId: uuid("club_id")
      .notNull()
      .references(() => clubs.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    planId: uuid("plan_id")
      .notNull()
      .references(() => clubSubscriptionPlans.id, { onDelete: "restrict" }),
    stripeSubscriptionId: text("stripe_subscription_id").notNull(),
    status: membershipStatusEnum("status").default("incomplete").notNull(),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    stripeSubscriptionUniqueIdx: uniqueIndex("club_memberships_stripe_sub_unique_idx").on(
      table.stripeSubscriptionId,
    ),
    clubUserUniqueIdx: uniqueIndex("club_memberships_club_user_unique_idx").on(
      table.clubId,
      table.userId,
    ),
  }),
);

export const membershipCancellationRequests = pgTable(
  "membership_cancellation_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    membershipId: uuid("membership_id")
      .notNull()
      .references(() => clubMemberships.id, { onDelete: "cascade" }),
    requestedByUserId: uuid("requested_by_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    reason: text("reason").notNull(),
    status: cancellationRequestStatusEnum("status").default("requested").notNull(),
    resolvedByAdminUserId: uuid("resolved_by_admin_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    pendingMembershipUniqueIdx: uniqueIndex("cancel_requests_pending_membership_unique_idx").on(
      table.membershipId,
      table.status,
    ),
  }),
);

export type UserRecord = typeof users.$inferSelect;
