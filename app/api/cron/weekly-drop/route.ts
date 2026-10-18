import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { weeklyScriptsFor } from "@/lib/weekly";

export const runtime = "nodejs";
export const maxDuration = 60;

// Monday-morning job: regenerate each agent's 3 weekly drafts.
// Secured by CRON_SECRET (Vercel Cron sends it as a Bearer token).
// In dev with no secret set, it runs unauthenticated for testing.
function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

async function run(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const agents = await prisma.agent.findMany();
  let created = 0;

  for (const agent of agents) {
    // Replace only un-approved drafts; approved ones already left as content.
    await prisma.weeklyScript.deleteMany({ where: { agentId: agent.id, status: "pending" } });
    const rows = await weeklyScriptsFor(agent);
    await prisma.weeklyScript.createMany({
      data: rows.map((r) => ({ ...r, agentId: agent.id })),
    });
    created += rows.length;
  }

  return NextResponse.json({ ok: true, agents: agents.length, created, at: new Date().toISOString() });
}

export async function GET(req: Request) {
  return run(req);
}
export async function POST(req: Request) {
  return run(req);
}
