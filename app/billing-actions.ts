"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSessionAgentId } from "@/lib/auth";
import { stripe, stripeEnabled, priceIdFor, planById } from "@/lib/billing";

// Start a plan upgrade. With Stripe configured → real Checkout.
// Without keys → mock: apply the plan immediately so the flow is testable.
export async function startCheckout(planId: string) {
  const agentId = await getSessionAgentId();
  if (!agentId) redirect("/login");
  const plan = planById(planId);
  if (!plan) return;

  if (stripeEnabled && stripe) {
    const origin = headers().get("origin") || "http://localhost:4200";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceIdFor(planId), quantity: 1 }],
      success_url: `${origin}/dashboard/settings?upgraded=${planId}`,
      cancel_url: `${origin}/dashboard/settings`,
      client_reference_id: agentId,
      metadata: { agentId, planId },
    });
    redirect(session.url!);
  }

  // Mock path
  await prisma.agent.update({
    where: { id: agentId },
    data: { plan: plan.name, creditsTotal: plan.videos, creditsUsed: 0 },
  });
  revalidatePath("/dashboard", "layout");
  redirect(`/dashboard/settings?upgraded=${planId}`);
}
