"use server";

import { prisma } from "@/lib/db";
import { getSessionAgentId } from "@/lib/auth";
import { schedulerProvider } from "@/lib/integrations";

async function agentPlatforms(agentId: string): Promise<string> {
  const socials = await prisma.socialAccount.findMany({ where: { agentId, connected: true } });
  const p = socials.map((s) => s.platform);
  return p.length ? p.join(",") : "instagram,facebook";
}

// Push an approved/scheduled item to the scheduler (GHL when wired, else mock).
async function pushToScheduler(
  contentId: string,
  caption: string,
  platforms: string[],
  when: Date,
  requireApproval: boolean,
) {
  try {
    await schedulerProvider.schedule({
      contentId,
      caption,
      platforms,
      scheduledFor: when.toISOString(),
      requireApproval,
    });
  } catch (e) {
    console.error("scheduler error", e);
  }
}

// Approve a Monday-Drop script: build a scheduled video, remove the draft.
export async function approveWeekly(weeklyId: string) {
  const agentId = await getSessionAgentId();
  if (!agentId) return { error: "unauthorized" };
  const w = await prisma.weeklyScript.findFirst({ where: { id: weeklyId, agentId } });
  if (!w) return { error: "not found" };

  const agent = await prisma.agent.findUnique({ where: { id: agentId } });
  const platforms = await agentPlatforms(agentId);
  const when = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  const item = await prisma.contentItem.create({
    data: {
      agentId,
      kind: "video",
      title: w.title,
      typeLabel: w.tag,
      status: "scheduled",
      caption: w.caption,
      platforms,
      thumb: "from-brand to-brand-dark",
      scheduledFor: when,
    },
  });
  await prisma.weeklyScript.delete({ where: { id: weeklyId } });
  await pushToScheduler(item.id, w.caption, platforms.split(","), when, agent?.approveBeforePosting ?? true);
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
  const item = await prisma.contentItem.findFirst({ where: { id: contentId, agentId } });
  if (!item) return { error: "not found" };

  const agent = await prisma.agent.findUnique({ where: { id: agentId } });
  const when = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  await prisma.contentItem.update({
    where: { id: contentId },
    data: { status: "scheduled", scheduledFor: when },
  });
  await pushToScheduler(
    contentId,
    item.caption,
    item.platforms.split(",").filter(Boolean),
    when,
    agent?.approveBeforePosting ?? true,
  );
  return { ok: true };
}
