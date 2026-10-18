"use server";

import { prisma } from "@/lib/db";
import { getSessionAgentId } from "@/lib/auth";

async function agentPlatforms(agentId: string): Promise<string> {
  const socials = await prisma.socialAccount.findMany({ where: { agentId, connected: true } });
  const p = socials.map((s) => s.platform);
  return p.length ? p.join(",") : "instagram,facebook";
}

// Approve a Monday-Drop script: build a scheduled video, remove the draft.
export async function approveWeekly(weeklyId: string) {
  const agentId = await getSessionAgentId();
  if (!agentId) return { error: "unauthorized" };
  const w = await prisma.weeklyScript.findFirst({ where: { id: weeklyId, agentId } });
  if (!w) return { error: "not found" };

  await prisma.contentItem.create({
    data: {
      agentId,
      kind: "video",
      title: w.title,
      typeLabel: w.tag,
      status: "scheduled",
      caption: w.caption,
      platforms: await agentPlatforms(agentId),
      thumb: "from-brand to-brand-dark",
      scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
  });
  await prisma.weeklyScript.delete({ where: { id: weeklyId } });
  return { ok: true };
}

// Save a generated picture post to the library.
export async function savePicture(input: { title: string; caption: string; thumb: string }) {
  const agentId = await getSessionAgentId();
  if (!agentId) return { error: "unauthorized" };
  const item = await prisma.contentItem.create({
    data: {
      agentId,
      kind: "picture",
      title: input.title,
      typeLabel: "Picture Post",
      status: "ready",
      caption: input.caption,
      platforms: await agentPlatforms(agentId),
      thumb: input.thumb,
    },
  });
  return { ok: true, id: item.id };
}

// Approve + schedule a library item.
export async function scheduleContent(contentId: string) {
  const agentId = await getSessionAgentId();
  if (!agentId) return { error: "unauthorized" };
  await prisma.contentItem.updateMany({
    where: { id: contentId, agentId },
    data: { status: "scheduled", scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
  });
  return { ok: true };
}
