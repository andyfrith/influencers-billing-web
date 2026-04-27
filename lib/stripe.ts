import Stripe from "stripe";
import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { billingCustomers } from "@/db/schema";

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
