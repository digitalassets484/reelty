import { prisma } from "./db";
import { PLANS } from "./mock-data";

export function planPrice(name: string): number {
  return PLANS.find((p) => p.name === name)?.price ?? 0;
}

export type ClientRow = {
  id: string;
  name: string;
  email: string;
  plan: string;
  price: number;
  creditsUsed: number;
  creditsTotal: number;
  twinStatus: string;
  brokerage: string;
  niche: string;
  contentCount: number;
  createdAt: string;
};

type AgentWithCount = {
  id: string;
  name: string;
  email: string;
  plan: string;
  creditsUsed: number;
  creditsTotal: number;
  twinStatus: string;
  brokerage: string;
  niche: string;
  createdAt: Date;
  _count: { content: number };
};

function toRow(a: AgentWithCount): ClientRow {
  return {
    id: a.id,
    name: a.name,
    email: a.email,
    plan: a.plan,
    price: planPrice(a.plan),
    creditsUsed: a.creditsUsed,
    creditsTotal: a.creditsTotal,
    twinStatus: a.twinStatus,
    brokerage: a.brokerage,
    niche: a.niche,
    contentCount: a._count.content,
    createdAt: a.createdAt.toISOString(),
  };
}

export async function getAdminOverview() {
  const clients = (await prisma.agent.findMany({
    where: { isOwner: false },
    include: { _count: { select: { content: true } } },
    orderBy: { createdAt: "desc" },
  })) as AgentWithCount[];

  const mrr = clients.reduce((s, a) => s + planPrice(a.plan), 0);
  const creditsUsed = clients.reduce((s, a) => s + a.creditsUsed, 0);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const videosThisMonth = await prisma.contentItem.count({
    where: { kind: "video", createdAt: { gte: startOfMonth } },
  });

  return {
    clientCount: clients.length,
    mrr,
    creditsUsed,
    videosThisMonth,
    recent: clients.slice(0, 6).map(toRow),
  };
}

export async function getAllClients(): Promise<ClientRow[]> {
  const agents = (await prisma.agent.findMany({
    where: { isOwner: false },
    include: { _count: { select: { content: true } } },
    orderBy: { createdAt: "desc" },
  })) as AgentWithCount[];
  return agents.map(toRow);
}

export async function getClientDetail(id: string) {
  const a = await prisma.agent.findUnique({
    where: { id },
    include: { content: { orderBy: { createdAt: "desc" } }, socials: true, _count: { select: { content: true } } },
  });
  if (!a) return null;
  return {
    ...toRow(a as unknown as AgentWithCount),
    approveBeforePosting: a.approveBeforePosting,
    socials: a.socials.map((s) => ({ platform: s.platform, handle: s.handle, connected: s.connected })),
    content: a.content.map((c) => ({
      id: c.id,
      title: c.title,
      kind: c.kind,
      status: c.status,
      typeLabel: c.typeLabel,
      createdAt: c.createdAt.toISOString(),
    })),
  };
}
