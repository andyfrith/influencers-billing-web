import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["member", "admin"]);
export const clubStatusEnum = pgEnum("club_status", ["active", "archived"]);
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
    status: clubStatusEnum("status").default("active").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugUniqueIdx: uniqueIndex("clubs_slug_unique_idx").on(table.slug),
  }),
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
