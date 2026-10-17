import { NextResponse } from "next/server";
import { scriptProvider } from "@/lib/integrations";
import { ACCOUNT } from "@/lib/mock-data";

export const runtime = "nodejs";

// Real Claude when ANTHROPIC_API_KEY is set, mock otherwise.
// (Agent name/brokerage come from mock-data until auth + DB wiring lands.)
export async function POST(req: Request) {
  const body = await req.json();
  const result = await scriptProvider.write({
    videoType: body.videoType,
    brokerage: ACCOUNT.brokerage,
    agentName: ACCOUNT.name,
    inputs: body.inputs ?? {},
  });
  return NextResponse.json(result);
}
