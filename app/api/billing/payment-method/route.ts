import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { billingCustomers } from "@/db/schema";
import { getAppSession } from "@/lib/session";
import { getDefaultCardSummary, stripe } from "@/lib/stripe";

export async function POST(request: Request): Promise<Response> {
  try {
    const session = await getAppSession();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { paymentMethodId } = (await request.json()) as {
      paymentMethodId?: string;
    };

    if (!paymentMethodId) {
      return NextResponse.json({ error: "Payment method id is required." }, { status: 400 });
    }

    const [billingCustomer] = await db
      .select()
      .from(billingCustomers)
      .where(eq(billingCustomers.userId, userId))
      .limit(1);

    if (!billingCustomer) {
      return NextResponse.json({ error: "Billing profile not found." }, { status: 404 });
    }

    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: billingCustomer.stripeCustomerId,
    });

    await stripe.customers.update(billingCustomer.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return NextResponse.json({ message: "Payment method saved." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save payment method." },
      { status: 500 },
    );
  }
}

export async function GET(): Promise<Response> {
  try {
    const session = await getAppSession();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const [billingCustomer] = await db
      .select()
      .from(billingCustomers)
      .where(eq(billingCustomers.userId, userId))
      .limit(1);

    if (!billingCustomer) {
      return NextResponse.json({ paymentMethod: null });
    }

    const paymentMethod = await getDefaultCardSummary(billingCustomer.stripeCustomerId);

    return NextResponse.json({ paymentMethod });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch payment method." },
      { status: 500 },
    );
  }
}

export async function DELETE(): Promise<Response> {
  try {
    const session = await getAppSession();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const [billingCustomer] = await db
      .select()
      .from(billingCustomers)
      .where(eq(billingCustomers.userId, userId))
      .limit(1);

    if (!billingCustomer) {
      return NextResponse.json({ message: "No payment method to remove." });
    }

    const customer = await stripe.customers.retrieve(billingCustomer.stripeCustomerId, {
      expand: ["invoice_settings.default_payment_method"],
    });

    if (!customer.deleted && customer.invoice_settings.default_payment_method) {
      const paymentMethod = customer.invoice_settings.default_payment_method;
      const paymentMethodId =
        typeof paymentMethod === "string" ? paymentMethod : paymentMethod.id;

      await stripe.paymentMethods.detach(paymentMethodId);
      await stripe.customers.update(billingCustomer.stripeCustomerId, {
        // Stripe REST accepts null to clear the default payment method; SDK typings omit null.
        // @ts-expect-error — runtime payload matches Stripe API
        invoice_settings: { default_payment_method: null },
      });
    }

    return NextResponse.json({ message: "Payment method removed." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to remove payment method." },
      { status: 500 },
    );
  }
}
