import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.weeklyScript.deleteMany();
  await prisma.contentItem.deleteMany();
  await prisma.socialAccount.deleteMany();
  await prisma.agent.deleteMany();

  const agent = await prisma.agent.create({
    data: {
      email: "peter@reelty.app",
      passwordHash: await bcrypt.hash("reelty123", 10),
      name: "Peter Eki",
      brokerage: "lpt realty",
      niche: "New builds",
      plan: "Growth",
      creditsTotal: 20,
      creditsUsed: 7,
      approveBeforePosting: true,
      twinStatus: "ready",
      brandPrimary: "#F5A622",
      brandSecondary: "#1B5FAD",
      logoLabel: "PE",
    },
  });

  await prisma.socialAccount.createMany({
    data: [
      { agentId: agent.id, platform: "instagram", handle: "@newbuildguy", connected: true },
      { agentId: agent.id, platform: "facebook", handle: "Peter Eki Realty", connected: true },
      { agentId: agent.id, platform: "tiktok", handle: "@newbuildguy", connected: true },
      { agentId: agent.id, platform: "youtube", handle: "Peter Eki", connected: false },
      { agentId: agent.id, platform: "linkedin", handle: "Peter Eki", connected: false },
    ],
  });

  await prisma.contentItem.createMany({
    data: [
      {
        agentId: agent.id,
        kind: "video",
        title: "Just Listed — 123 Maple Ave SW",
        typeLabel: "New Listing",
        status: "ready",
        caption:
          "Just listed in Altadore and it won't last. 4 bed, 3 bath, renovated kitchen, west-facing yard. DM me for a private showing. 🏡 #yycrealestate #calgaryhomes",
        platforms: "instagram,facebook,tiktok",
        thumb: "from-brand to-brand-dark",
      },
      {
        agentId: agent.id,
        kind: "picture",
        title: "Open House Sunday — 88 Riverstone",
        typeLabel: "Picture Post",
        status: "scheduled",
        caption: "Open house this Sunday 1–3 PM. Come see this riverside stunner in person. 📍",
        platforms: "instagram,facebook",
        thumb: "from-emerald-500 to-teal-600",
        scheduledFor: new Date("2026-10-19T15:00:00Z"),
      },
      {
        agentId: agent.id,
        kind: "video",
        title: "Calgary Market Update — October",
        typeLabel: "Market Update",
        status: "posted",
        caption:
          "Calgary median price is up 4% month over month. Here's what that means if you're buying this fall. 📈",
        platforms: "instagram,youtube,linkedin",
        thumb: "from-indigo-500 to-purple-600",
        scheduledFor: new Date("2026-10-11T13:00:00Z"),
      },
      {
        agentId: agent.id,
        kind: "video",
        title: "Just Sold — Over Asking in 6 Days",
        typeLabel: "Just Sold",
        status: "draft",
        caption: "SOLD — over asking, multiple offers, 6 days on market. Thinking of selling? Let's talk.",
        platforms: "instagram,facebook",
        thumb: "from-amber-500 to-orange-600",
      },
    ],
  });

  await prisma.weeklyScript.createMany({
    data: [
      {
        agentId: agent.id,
        tag: "Market Update",
        title: "Calgary prices ticked up again this month",
        hook: "Calgary's market just shifted — here's what it means for you.",
        caption:
          "📈 Calgary's median price is up again month over month. Here's what buyers should do about it. DM me for your neighbourhood's numbers.",
      },
      {
        agentId: agent.id,
        tag: "New Build",
        title: "Why new-build inventory is a buyer's edge right now",
        hook: "Everyone's fighting over resale homes — here's the smarter play.",
        caption:
          "🏗️ New builds mean more choice, warranties and fewer bidding wars. Here's how to shop them the right way. Message me to tour a few.",
      },
      {
        agentId: agent.id,
        tag: "Buyer Tip",
        title: "The pre-approval mistake costing buyers thousands",
        hook: "This one pre-approval slip quietly costs buyers thousands.",
        caption:
          "💡 Getting pre-approved isn't the same as getting pre-approved right. Save this before you shop. Questions? DM me.",
      },
    ],
  });

  console.log("Seeded agent:", agent.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
