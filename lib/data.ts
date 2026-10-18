import { prisma } from "./db";
import type { ContentItem, SocialAccount, WeeklyScript } from "./mock-data";

export type AccountView = {
  name: string;
  email: string;
  brokerage: string;
  niche: string;
  plan: string;
  creditsTotal: number;
  creditsUsed: number;
  approveBeforePosting: boolean;
  twinStatus: "ready" | "training" | "none";
  brand: { primary: string; secondary: string; logoLabel: string };
};

export type DashboardData = {
  agent: AccountView;
  content: ContentItem[];
  socials: SocialAccount[];
  weekly: Pick<WeeklyScript, "id" | "tag" | "title" | "hook" | "caption">[];
};

export async function getDashboardData(agentId: string): Promise<DashboardData | null> {
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    include: {
      socials: true,
      content: { orderBy: { createdAt: "desc" } },
      weeklyScripts: { orderBy: { weekOf: "desc" } },
    },
  });
  if (!agent) return null;

  return {
    agent: {
      name: agent.name,
      email: agent.email,
      brokerage: agent.brokerage,
      niche: agent.niche,
      plan: agent.plan,
      creditsTotal: agent.creditsTotal,
      creditsUsed: agent.creditsUsed,
      approveBeforePosting: agent.approveBeforePosting,
      twinStatus: agent.twinStatus as AccountView["twinStatus"],
      brand: { primary: agent.brandPrimary, secondary: agent.brandSecondary, logoLabel: agent.logoLabel },
    },
    content: agent.content.map((c) => ({
      id: c.id,
      kind: c.kind as ContentItem["kind"],
      title: c.title,
      typeLabel: c.typeLabel,
      status: c.status as ContentItem["status"],
      caption: c.caption,
      createdAt: c.createdAt.toISOString(),
      scheduledFor: c.scheduledFor ? c.scheduledFor.toISOString() : undefined,
      platforms: c.platforms ? c.platforms.split(",").filter(Boolean) : [],
      thumb: c.thumb,
    })),
    socials: agent.socials.map((s) => ({
      platform: s.platform as SocialAccount["platform"],
      handle: s.handle,
      connected: s.connected,
    })),
    weekly: agent.weeklyScripts.map((w) => ({
      id: w.id,
      tag: w.tag,
      title: w.title,
      hook: w.hook,
      caption: w.caption,
    })),
  };
}
