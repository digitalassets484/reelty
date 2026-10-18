import { scriptProvider } from "./integrations";

// Generates this week's 3 drafts for one agent, tailored to their niche.
// Uses the script provider (real Claude when keyed, mock otherwise), so the
// Monday Drop gets fresher copy automatically once the Anthropic key is set.
// Phase 2.5: feed live Calgary market data into the "Market Update" angle.
export async function weeklyScriptsFor(agent: {
  name: string;
  brokerage: string;
  niche: string;
}): Promise<{ tag: string; title: string; hook: string; caption: string }[]> {
  const niche = (agent.niche || "real estate").trim();
  const nicheLower = niche.toLowerCase();

  const angles: { tag: string; videoType: string; title: string; inputs: Record<string, string> }[] = [
    {
      tag: "Market Update",
      videoType: "market-update",
      title: "This week in the Calgary market",
      inputs: {
        area: "Calgary",
        stat: "prices are moving again",
        take: `what it means for ${nicheLower} buyers this week`,
      },
    },
    {
      tag: niche,
      videoType: "buyer-seller-tip",
      title: `The ${nicheLower} angle buyers keep asking about`,
      inputs: { topic: nicheLower, angle: `why ${nicheLower} is worth a serious look right now` },
    },
    {
      tag: "Seller Tip",
      videoType: "buyer-seller-tip",
      title: "A seller move that pays off this season",
      inputs: { topic: "selling for top dollar", angle: "the prep step most sellers skip" },
    },
  ];

  const rows = [];
  for (const a of angles) {
    const s = await scriptProvider.write({
      videoType: a.videoType,
      brokerage: agent.brokerage,
      agentName: agent.name,
      inputs: a.inputs,
    });
    rows.push({ tag: a.tag, title: a.title, hook: s.hook, caption: s.caption });
  }
  return rows;
}
