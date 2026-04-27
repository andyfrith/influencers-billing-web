import Stripe from "stripe";
import { and, eq } from "drizzle-orm";

import { db } from "@/db/client";
import {
  billingCustomers,
  clubMemberships,
  clubSubscriptionPlans,
  clubs,
  membershipCancellationRequests,
} from "@/db/schema";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("STRIPE_SECRET_KEY is required.");
}

export const stripe = new Stripe(secretKey);

/**
 * Returns an existing Stripe customer id for a user or creates one.
 */
export async function ensureStripeCustomer(input: {
  userId: string;
  email: string;
}): Promise<string> {
  const [existing] = await db
    .select()
    .from(billingCustomers)
    .where(eq(billingCustomers.userId, input.userId))
    .limit(1);

  if (existing) {
    return existing.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: input.email,
    metadata: {
      userId: input.userId,
    },
  });

  await db.insert(billingCustomers).values({
    userId: input.userId,
    stripeCustomerId: customer.id,
  });

  return customer.id;
}

/**
 * Returns a minimal payment method summary for UI.
 */
export async function getDefaultCardSummary(stripeCustomerId: string): Promise<{
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
} | null> {
  const customer = await stripe.customers.retrieve(stripeCustomerId, {
    expand: ["invoice_settings.default_payment_method"],
  });

  if (customer.deleted) {
    return null;
  }

  const defaultMethod = customer.invoice_settings.default_payment_method;
  if (!defaultMethod || typeof defaultMethod === "string" || !defaultMethod.card) {
    return null;
  }

  return {
    brand: defaultMethod.card.brand,
    last4: defaultMethod.card.last4,
    expMonth: defaultMethod.card.exp_month,
    expYear: defaultMethod.card.exp_year,
  };
}

/**
 * Creates a Stripe recurring price for a club plan.
 */
export async function createStripePriceForClubPlan(input: {
  clubName: string;
  planName: string;
  interval: "month" | "year";
  amountCents: number;
  currency: string;
}): Promise<string> {
  const product = await stripe.products.create({
    name: `${input.clubName} - ${input.planName}`,
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: input.amountCents,
    currency: input.currency,
    recurring: { interval: input.interval },
  });

  return price.id;
}

/**
 * Creates or replaces a membership subscription.
 */
export async function createMembershipSubscription(input: {
  userId: string;
  email: string;
  planId: string;
  clubId: string;
}): Promise<{
  subscriptionId: string;
  status: string;
  currentPeriodEnd: Date | null;
}> {
  const [plan] = await db
    .select({
      id: clubSubscriptionPlans.id,
      stripePriceId: clubSubscriptionPlans.stripePriceId,
      clubId: clubSubscriptionPlans.clubId,
      isActive: clubSubscriptionPlans.isActive,
    })
    .from(clubSubscriptionPlans)
    .where(eq(clubSubscriptionPlans.id, input.planId))
    .limit(1);

  if (!plan || !plan.isActive || plan.clubId !== input.clubId) {
    throw new Error("Invalid or inactive plan.");
  }

  const stripeCustomerId = await ensureStripeCustomer({
    userId: input.userId,
    email: input.email,
  });

  const subscription = await stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: [{ price: plan.stripePriceId }],
    payment_behavior: "default_incomplete",
    collection_method: "charge_automatically",
    expand: ["latest_invoice.payment_intent"],
  });

  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : null;

  await db
    .insert(clubMemberships)
    .values({
      userId: input.userId,
      clubId: plan.clubId,
      planId: plan.id,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd,
    })
    .onConflictDoUpdate({
      target: [clubMemberships.clubId, clubMemberships.userId],
      set: {
        planId: plan.id,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd,
        updatedAt: new Date(),
      },
    });

  return {
    subscriptionId: subscription.id,
    status: subscription.status,
    currentPeriodEnd,
  };
}

/**
 * Cancels a membership subscription and updates related records.
 */
export async function cancelMembershipSubscription(input: {
  membershipId: string;
  adminUserId: string;
  cancellationRequestId?: string;
}): Promise<void> {
  const [membership] = await db
    .select()
    .from(clubMemberships)
    .where(eq(clubMemberships.id, input.membershipId))
    .limit(1);

  if (!membership) {
    throw new Error("Membership not found.");
  }

  await stripe.subscriptions.cancel(membership.stripeSubscriptionId);

  await db
    .update(clubMemberships)
    .set({
      status: "canceled",
      updatedAt: new Date(),
    })
    .where(eq(clubMemberships.id, membership.id));

  if (input.cancellationRequestId) {
    await db
      .update(membershipCancellationRequests)
      .set({
        status: "completed",
        resolvedByAdminUserId: input.adminUserId,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(membershipCancellationRequests.id, input.cancellationRequestId),
          eq(membershipCancellationRequests.membershipId, membership.id),
        ),
      );
  }
}

/**
 * Returns club list with active plans.
 */
export async function listClubsWithPlans() {
  const clubsRows = await db.select().from(clubs).where(eq(clubs.status, "active"));
  const plansRows = await db
    .select()
    .from(clubSubscriptionPlans)
    .where(eq(clubSubscriptionPlans.isActive, true));

  return clubsRows.map((club) => ({
    ...club,
    plans: plansRows.filter((plan) => plan.clubId === club.id),
  }));
}
