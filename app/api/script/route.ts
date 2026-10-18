import { NextResponse } from "next/server";
import { scriptProvider } from "@/lib/integrations";
import { getCurrentAgent } from "@/lib/auth";

export const runtime = "nodejs";

// Real Claude when ANTHROPIC_API_KEY is set, mock otherwise.
// Agent name/brokerage come from the logged-in session.
export async function POST(req: Request) {
  const body = await req.json();
  const agent = await getCurrentAgent();
  const result = await scriptProvider.write({
    videoType: body.videoType,
    brokerage: agent?.brokerage || "",
    agentName: agent?.name || "Your Agent",
    inputs: body.inputs ?? {},
  });
  return NextResponse.json(result);
}
