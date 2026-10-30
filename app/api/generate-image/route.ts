import { NextResponse } from "next/server";
import { imageGenProvider } from "@/lib/integrations";
import { getSessionAgentId } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const agentId = await getSessionAgentId();
  if (!agentId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { prompt } = await req.json().catch(() => ({ prompt: "" }));
  if (!prompt) return NextResponse.json({ error: "no-prompt" }, { status: 400 });

  if (!imageGenProvider) return NextResponse.json({ error: "no-gemini" }, { status: 503 });

  const r = await imageGenProvider.generate(prompt);
  if (!r.imageUrl) return NextResponse.json({ error: "generation-failed" }, { status: 502 });
  return NextResponse.json({ imageUrl: r.imageUrl });
}
