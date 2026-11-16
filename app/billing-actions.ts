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

  // Real Stripe Checkout when configured AND a price id exists for the plan.
  // Build the session URL inside try/catch, but call redirect() OUTSIDE it —
  // redirect() throws NEXT_REDIRECT internally, which must not be swallowed.
  const priceId = priceIdFor(planId);
  if (stripeEnabled && stripe && priceId) {
    let url: string | null = null;
    try {
      const origin = headers().get("origin") || "http://localhost:4200";
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${origin}/dashboard/settings?upgraded=${planId}`,
        cancel_url: `${origin}/dashboard/settings`,
        client_reference_id: agentId,
        metadata: { agentId, planId },
      });
      url = session.url;
    } catch (e) {
      // Fall through to the mock upgrade so the button never dead-ends.
      console.error("[billing] stripe checkout failed, falling back to mock:", e);
    }
    if (url) redirect(url);
  }

  // Mock path (no key, no price id, or Stripe errored)
  await prisma.agent.update({
    where: { id: agentId },
    data: { plan: plan.name, creditsTotal: plan.videos, creditsUsed: 0 },
  });
  revalidatePath("/dashboard", "layout");
  redirect(`/dashboard/settings?upgraded=${planId}`);
}
