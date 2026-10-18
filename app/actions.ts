"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword, createSession, clearSession } from "@/lib/auth";

export type AuthState = { error?: string };

export async function signupAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Email and password are required." };
  if (password.length < 6) return { error: "Password must be at least 6 characters." };

  const existing = await prisma.agent.findUnique({ where: { email } });
  if (existing) return { error: "An account with that email already exists." };

  const agent = await prisma.agent.create({
    data: {
      email,
      name: name || email.split("@")[0],
      brokerage: "",
      passwordHash: await hashPassword(password),
      twinStatus: "none",
    },
  });

  await createStarterData(agent.id);
  await createSession(agent.id);
  redirect("/dashboard");
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const agent = await prisma.agent.findUnique({ where: { email } });
  if (!agent || !agent.passwordHash || !(await verifyPassword(password, agent.passwordHash))) {
    return { error: "Wrong email or password." };
  }
  await createSession(agent.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  clearSession();
  redirect("/login");
}

// Give brand-new accounts a live-looking dashboard: this week's scripts + a sample draft.
async function createStarterData(agentId: string) {
  await prisma.weeklyScript.createMany({
    data: [
      {
        agentId,
        tag: "Market Update",
        title: "Calgary prices ticked up again this month",
        hook: "Calgary's market just shifted — here's what it means for you.",
        caption:
          "📈 Calgary's median price is up again month over month. Here's what buyers should do about it. DM me for your neighbourhood's numbers.",
      },
      {
        agentId,
        tag: "Buyer Tip",
        title: "The pre-approval mistake costing buyers thousands",
        hook: "This one pre-approval slip quietly costs buyers thousands.",
        caption:
          "💡 Getting pre-approved isn't the same as getting pre-approved right. Save this before you shop. Questions? DM me.",
      },
      {
        agentId,
        tag: "Neighbourhood",
        title: "Why buyers keep choosing this community",
        hook: "Everyone's asking about this neighbourhood right now.",
        caption: "📍 Great walkability, strong community, homes with character. Want in? Message me.",
      },
    ],
  });

  await prisma.contentItem.create({
    data: {
      agentId,
      kind: "video",
      title: "Welcome — Meet the Agent",
      typeLabel: "Meet the Agent",
      status: "draft",
      caption: "Hi, I'm your local real estate agent. Here's how I can help you buy or sell with confidence.",
      platforms: "instagram,facebook",
      thumb: "from-rose-500 to-pink-600",
    },
  });
}
