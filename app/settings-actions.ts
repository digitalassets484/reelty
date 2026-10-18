"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSessionAgentId } from "@/lib/auth";

export async function updateProfile(formData: FormData) {
  const agentId = await getSessionAgentId();
  if (!agentId) return;
  const name = String(formData.get("name") ?? "").trim();
  await prisma.agent.update({
    where: { id: agentId },
    data: {
      name: name || undefined,
      brokerage: String(formData.get("brokerage") ?? "").trim(),
      niche: String(formData.get("niche") ?? "").trim() || "New builds",
    },
  });
  revalidatePath("/dashboard", "layout");
}

export async function toggleSocial(platform: string) {
  const agentId = await getSessionAgentId();
  if (!agentId) return;
  const s = await prisma.socialAccount.findFirst({ where: { agentId, platform } });
  if (s) {
    await prisma.socialAccount.update({ where: { id: s.id }, data: { connected: !s.connected } });
  }
  revalidatePath("/dashboard", "layout");
}

export async function setApprove(value: boolean) {
  const agentId = await getSessionAgentId();
  if (!agentId) return;
  await prisma.agent.update({ where: { id: agentId }, data: { approveBeforePosting: value } });
  revalidatePath("/dashboard", "layout");
}

export async function createTwin() {
  const agentId = await getSessionAgentId();
  if (!agentId) return;
  await prisma.agent.update({ where: { id: agentId }, data: { twinStatus: "ready" } });
  revalidatePath("/dashboard", "layout");
}
