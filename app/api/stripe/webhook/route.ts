import { NextResponse } from "next/server";
import { stripe, stripeEnabled, planById } from "@/lib/billing";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// Confirms real payments and updates the agent's plan + monthly credits.
// Inert until STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET are set.
export async function POST(req: Request) {
  if (!stripeEnabled || !stripe) {
    return NextResponse.json({ ok: true, skipped: "stripe not configured" });
  }

  const sig = req.headers.get("stripe-signature") || "";
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as { metadata?: Record<string, string>; client_reference_id?: string };
    const agentId = s.metadata?.agentId || s.client_reference_id;
    const plan = s.metadata?.planId ? planById(s.metadata.planId) : null;
    if (agentId && plan) {
      await prisma.agent.update({
        where: { id: agentId },
        data: { plan: plan.name, creditsTotal: plan.videos, creditsUsed: 0 },
      });
    }
  }

  return NextResponse.json({ received: true });
}
