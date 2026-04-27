import { NextResponse } from "next/server";

import { getAppSession } from "@/lib/session";
import { ensureStripeCustomer, stripe } from "@/lib/stripe";

export async function POST(): Promise<Response> {
  try {
    const session = await getAppSession();
    const userId = session?.user?.id;
    const email = session?.user?.email;

    if (!userId || !email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const stripeCustomerId = await ensureStripeCustomer({
      userId,
      email,
    });

    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      usage: "off_session",
    });

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      stripeCustomerId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create setup intent." },
      { status: 500 },
    );
  }
}
