import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionAgentId } from "@/lib/auth";
import { videoProvider } from "@/lib/integrations";

export const runtime = "nodejs";

// Renders the avatar video and meters one credit (two for > 60s).
// Rejects with 402 when the agent is out of credits.
export async function POST(req: Request) {
  const { durationSec = 45, script = "" } = await req.json().catch(() => ({}));
  const agentId = await getSessionAgentId();
  if (!agentId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const agent = await prisma.agent.findUnique({ where: { id: agentId } });
  if (!agent) return NextResponse.json({ error: "no agent" }, { status: 404 });

  const cost = durationSec > 60 ? 2 : 1;
  if (agent.creditsUsed + cost > agent.creditsTotal) {
    return NextResponse.json(
      { error: "no-credits", creditsLeft: agent.creditsTotal - agent.creditsUsed },
      { status: 402 },
    );
  }

  // Real render happens here when HeyGen is wired; mock for now.
  const job = await videoProvider.render({ script, avatarId: "twin_default", durationSec });
  await videoProvider.getJob(job.jobId);

  const updated = await prisma.agent.update({
    where: { id: agentId },
    data: { creditsUsed: agent.creditsUsed + cost },
  });

  return NextResponse.json({
    ok: true,
    creditsUsed: updated.creditsUsed,
    creditsTotal: updated.creditsTotal,
    creditsLeft: updated.creditsTotal - updated.creditsUsed,
  });
}
