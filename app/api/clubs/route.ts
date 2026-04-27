import { NextResponse } from "next/server";

import { listClubsWithPlans } from "@/lib/stripe";

export async function GET(): Promise<Response> {
  try {
    const clubs = await listClubsWithPlans();
    return NextResponse.json({ clubs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load clubs." }, { status: 500 });
  }
}
