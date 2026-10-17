import type { ScriptProvider, ScriptRequest, ScriptResult } from "./types";

// MOCK Claude script writer.
// Phase 2: call the Claude Messages API with a real-estate system prompt.
// Cost is pennies, so script revisions stay free for the agent.
export class MockClaude implements ScriptProvider {
  async write(req: ScriptRequest): Promise<ScriptResult> {
    await delay(600);
    const i = req.inputs;
    const disclosure = `${req.agentName}, ${req.brokerage}. Not intended to solicit properties already listed.`;

    // Video Agent: a free-form prompt instead of a structured format.
    if (req.videoType === "video-agent") {
      const p = (i.prompt || "").trim();
      const firstSentence = p.split(/[.!?\n]/)[0]?.trim() || "my latest update";
      return {
        hook: p ? (p.length > 64 ? firstSentence : p) : "You're going to want to see this.",
        script: `${p || "Here's my latest update."}\n\nThat's the short version. If you've got questions or you're thinking about your next move, send me a message and let's talk.`,
        caption: `${firstSentence}. DM me and let's chat. 🏡`,
        hashtags: ["#yycrealestate", "#calgaryrealtor", "#realestate", "#yyc"],
        disclosure,
      };
    }

    const byType: Record<string, ScriptResult> = {
      "new-listing": {
        hook: `Just listed${i.address ? ` at ${i.address}` : ""} — and it won't last.`,
        script: `Just listed${i.address ? ` at ${i.address}` : ""}${i.price ? `, offered at ${i.price}` : ""}. ${i.beds ? i.beds + ". " : ""}${i.highlights || "A home that checks every box."} If you've been waiting for the right one, this is it. DM me and I'll get you in before the weekend.`,
        caption: `🏡 JUST LISTED${i.address ? ` — ${i.address}` : ""}${i.price ? ` · ${i.price}` : ""}. ${i.highlights || ""} Tap the link or DM me for a private showing.`,
        hashtags: ["#yycrealestate", "#calgaryhomes", "#justlisted", "#yycliving"],
        disclosure,
      },
      "just-sold": {
        hook: `SOLD${i.daysOnMarket ? ` in ${i.daysOnMarket}` : ""}.`,
        script: `Another one sold${i.address ? ` at ${i.address}` : ""}${i.daysOnMarket ? ` — ${i.daysOnMarket} on market` : ""}. ${i.note || "The right strategy makes all the difference."} If you're thinking about selling, let's talk about what your home could do in this market.`,
        caption: `✅ JUST SOLD${i.daysOnMarket ? ` in ${i.daysOnMarket}` : ""}. ${i.note || ""} Thinking of selling? Let's chat.`,
        hashtags: ["#justsold", "#yycrealestate", "#calgaryrealtor", "#soldbypeter"],
        disclosure,
      },
      "market-update": {
        hook: `${i.area || "Calgary"}'s market just shifted.`,
        script: `Quick ${i.area || "Calgary"} market update. ${i.stat || "Prices are moving."} ${i.take || "Here's what that means for you this month."} Want the full picture for your neighbourhood? Send me a message.`,
        caption: `📈 ${i.area || "Calgary"} MARKET UPDATE. ${i.stat || ""} ${i.take || ""}`,
        hashtags: ["#calgarymarket", "#yycrealestate", "#marketupdate", "#realestatetips"],
        disclosure,
      },
      neighbourhood: {
        hook: `Why everyone's moving to ${i.area || "this neighbourhood"}.`,
        script: `Let's talk about ${i.area || "this neighbourhood"}. ${i.lovePoints || "Great walkability, strong community, and homes with character."} It's one of my favourite pockets of the city. Curious what's available here? I've got you.`,
        caption: `📍 NEIGHBOURHOOD SPOTLIGHT: ${i.area || ""}. ${i.lovePoints || ""}`,
        hashtags: ["#yycliving", "#calgaryneighbourhoods", `#${(i.area || "calgary").replace(/\s+/g, "").toLowerCase()}`],
        disclosure,
      },
      "buyer-seller-tip": {
        hook: `The ${i.topic || "one thing"} most people get wrong.`,
        script: `Here's a quick tip on ${i.topic || "buying and selling"}. ${i.angle || "A small detail that saves big money."} Save this one and send me a message if you want help applying it to your situation.`,
        caption: `💡 TIP: ${i.topic || ""}. ${i.angle || ""} Save this 👆`,
        hashtags: ["#realestatetips", "#yycrealestate", "#homebuyingtips"],
        disclosure,
      },
    };

    return byType[req.videoType] ?? byType["new-listing"];
  }
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
