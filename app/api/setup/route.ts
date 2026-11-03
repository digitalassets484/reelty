import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// One-time DB seed, guarded by CRON_SECRET. Hit it once after the first deploy:
//   /api/setup?secret=YOUR_CRON_SECRET
export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!process.env.CRON_SECRET || url.searchParams.get("secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const result = await seedDatabase();
  return NextResponse.json({ ok: true, ...result });
}
