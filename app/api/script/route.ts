import { NextResponse } from "next/server";
import { scriptProvider } from "@/lib/integrations";
import { MockClaude } from "@/lib/integrations/claude";
import { getCurrentAgent } from "@/lib/auth";

export const runtime = "nodejs";

// Real Claude when ANTHROPIC_API_KEY is set, mock otherwise.
// Agent name/brokerage come from the logged-in session.
// If the real API call fails (no billing credit yet, rate limit, outage),
// we fall back to the mock generator so the Video Agent never 500s on the user.
export async function POST(req: Request) {
  const body = await req.json();
  const agent = await getCurrentAgent();
  const request = {
    videoType: body.videoType,
    brokerage: agent?.brokerage || "",
    agentName: agent?.name || "Your Agent",
    inputs: body.inputs ?? {},
  };

  try {
    const result = await scriptProvider.write(request);
    return NextResponse.json(result);
  } catch (e) {
    // Graceful degradation: the real provider failed, serve a generated script.
    console.error("[script] provider failed, falling back to mock:", e);
    const result = await new MockClaude().write(request);
    return NextResponse.json({ ...result, _fallback: true });
  }
}
