"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentAgent } from "@/lib/auth";
import { PLANS } from "@/lib/mock-data";

async function requireOwner() {
  const me = await getCurrentAgent();
  if (!me?.isOwner) throw new Error("forbidden");
  return me;
}

export async function setClientPlan(agentId: string, planId: string) {
  await requireOwner();
  const plan = PLANS.find((p) => p.id === planId);
  if (!plan) return;
  await prisma.agent.update({
    where: { id: agentId },
    data: { plan: plan.name, creditsTotal: plan.videos },
  });
  revalidatePath(`/admin/clients/${agentId}`);
  revalidatePath("/admin/clients");
  revalidatePath("/admin");
}

export async function resetClientCredits(agentId: string) {
  await requireOwner();
  await prisma.agent.update({ where: { id: agentId }, data: { creditsUsed: 0 } });
  revalidatePath(`/admin/clients/${agentId}`);
  revalidatePath("/admin");
}
