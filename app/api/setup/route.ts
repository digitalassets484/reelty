import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Table DDL matching the Prisma schema (Postgres, quoted camelCase identifiers).
const DDL = [
  `CREATE TABLE IF NOT EXISTS "Agent" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT,
    "isOwner" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "brokerage" TEXT NOT NULL,
    "niche" TEXT NOT NULL DEFAULT 'New builds',
    "plan" TEXT NOT NULL DEFAULT 'Growth',
    "creditsTotal" INTEGER NOT NULL DEFAULT 20,
    "creditsUsed" INTEGER NOT NULL DEFAULT 0,
    "approveBeforePosting" BOOLEAN NOT NULL DEFAULT true,
    "twinStatus" TEXT NOT NULL DEFAULT 'none',
    "brandPrimary" TEXT NOT NULL DEFAULT '#2F6BFF',
    "brandSecondary" TEXT NOT NULL DEFAULT '#1B5FAD',
    "logoLabel" TEXT NOT NULL DEFAULT 'PE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "SocialAccount" (
    "id" TEXT PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "connected" BOOLEAN NOT NULL DEFAULT false
  )`,
  `CREATE TABLE IF NOT EXISTS "ContentItem" (
    "id" TEXT PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "typeLabel" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "caption" TEXT NOT NULL,
    "platforms" TEXT NOT NULL,
    "thumb" TEXT NOT NULL,
    "imageUrl" TEXT,
    "scheduledFor" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "WeeklyScript" (
    "id" TEXT PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "hook" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "weekOf" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
];

// One-time: create tables (if needed) + seed. Guarded by CRON_SECRET.
//   /api/setup?secret=YOUR_CRON_SECRET
export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!process.env.CRON_SECRET || url.searchParams.get("secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    for (const stmt of DDL) {
      await prisma.$executeRawUnsafe(stmt);
    }
    const result = await seedDatabase();
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
