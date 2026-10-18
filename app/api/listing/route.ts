import { NextResponse } from "next/server";
import { parseListing } from "@/lib/listing";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { url } = await req.json().catch(() => ({ url: "" }));
  if (!url) return NextResponse.json({ fallback: true });
  const parsed = await parseListing(url);
  const hasAny = Object.values(parsed).some((v) => v && String(v).trim());
  return NextResponse.json({ ...parsed, fallback: !hasAny });
}
