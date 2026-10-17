// ─────────────────────────────────────────────────────────────
// Mock data for the Reelty prototype.
// In Phase 2 this is replaced by the database + real integrations.
// ─────────────────────────────────────────────────────────────

export type VideoType = {
  id: string;
  label: string;
  emoji: string;
  blurb: string;
  card: { title: string; tagline: string; gradient: string }; // HeyGen-style gallery card
  inputs: { key: string; label: string; placeholder: string; type?: "text" | "textarea" }[];
};

export const VIDEO_TYPES: VideoType[] = [
  {
    id: "new-listing",
    label: "New Listing",
    emoji: "🏡",
    blurb: "Announce a fresh listing with a scroll-stopping hook.",
    card: { title: "Just Listed", tagline: "Announce a new listing", gradient: "from-brand to-indigo-700" },
    inputs: [
      { key: "listingLink", label: "Listing link", placeholder: "Paste your Realtor.ca or MLS link — we'll pull the details" },
      { key: "address", label: "Address", placeholder: "123 Maple Ave SW, Calgary" },
      { key: "price", label: "Price", placeholder: "$749,000" },
      { key: "beds", label: "Beds / Baths", placeholder: "4 bed · 3 bath" },
      { key: "highlights", label: "Highlights", placeholder: "Renovated kitchen, west-facing yard, walk to the river", type: "textarea" },
    ],
  },
  {
    id: "hosted-home-tour",
    label: "Hosted Home Tour",
    emoji: "🎥",
    blurb: "Walk buyers through the home, room by room.",
    card: { title: "Hosted Home Tour", tagline: "Walk through the home", gradient: "from-emerald-500 to-teal-600" },
    inputs: [
      { key: "listingLink", label: "Listing link", placeholder: "Paste your Realtor.ca or MLS link — we'll pull the details" },
      { key: "address", label: "Address", placeholder: "88 Riverstone Cres, Calgary" },
      { key: "price", label: "Price", placeholder: "$899,000" },
      { key: "rooms", label: "Rooms to feature", placeholder: "Great room, chef's kitchen, primary suite, backyard", type: "textarea" },
    ],
  },
  {
    id: "listing-spotlight",
    label: "Listing Spotlight",
    emoji: "✨",
    blurb: "A cinematic highlight reel of the property's best features.",
    card: { title: "Listing Spotlight", tagline: "Show off the best features", gradient: "from-violet-600 to-fuchsia-600" },
    inputs: [
      { key: "listingLink", label: "Listing link", placeholder: "Paste your Realtor.ca or MLS link — we'll pull the details" },
      { key: "address", label: "Address", placeholder: "214 Altadore Rd SW, Calgary" },
      { key: "price", label: "Price", placeholder: "$1,150,000" },
      { key: "highlights", label: "Standout features", placeholder: "Vaulted ceilings, chef's kitchen, mountain views", type: "textarea" },
    ],
  },
  {
    id: "market-update",
    label: "Market Update",
    emoji: "📈",
    blurb: "Position yourself as the local expert.",
    card: { title: "Market Update", tagline: "Be the local expert", gradient: "from-blue-600 to-cyan-600" },
    inputs: [
      { key: "area", label: "Area", placeholder: "Calgary / Altadore" },
      { key: "stat", label: "Key stat", placeholder: "Median price up 4% MoM" },
      { key: "take", label: "Your take", placeholder: "Why it matters for buyers this month", type: "textarea" },
    ],
  },
  {
    id: "just-sold",
    label: "Just Sold",
    emoji: "✅",
    blurb: "Celebrate a close and show social proof.",
    card: { title: "Just Sold", tagline: "Celebrate a close", gradient: "from-amber-500 to-orange-600" },
    inputs: [
      { key: "listingLink", label: "Listing link", placeholder: "Paste your Realtor.ca or MLS link — we'll pull the details" },
      { key: "address", label: "Address", placeholder: "88 Riverstone Cres, Calgary" },
      { key: "daysOnMarket", label: "Days on market", placeholder: "6 days" },
      { key: "note", label: "The story", placeholder: "Over asking, multiple offers", type: "textarea" },
    ],
  },
  {
    id: "meet-the-agent",
    label: "Meet the Agent",
    emoji: "👋",
    blurb: "Introduce yourself and build trust fast.",
    card: { title: "Meet the Agent", tagline: "Introduce yourself", gradient: "from-rose-500 to-pink-600" },
    inputs: [
      { key: "years", label: "Years in the business", placeholder: "16 years in Calgary" },
      { key: "specialty", label: "Your specialty", placeholder: "New builds & first-time buyers" },
      { key: "note", label: "What makes you different", placeholder: "Relationship-first, not transactional", type: "textarea" },
    ],
  },
  {
    id: "neighbourhood",
    label: "Neighbourhood Spotlight",
    emoji: "📍",
    blurb: "Sell the lifestyle, not just the house.",
    card: { title: "Neighbourhood Spotlight", tagline: "Sell the lifestyle", gradient: "from-cyan-600 to-sky-700" },
    inputs: [
      { key: "area", label: "Neighbourhood", placeholder: "Inglewood" },
      { key: "lovePoints", label: "What locals love", placeholder: "Coffee shops, river paths, walkable main street", type: "textarea" },
    ],
  },
  {
    id: "buyer-seller-tip",
    label: "Buyer / Seller Tip",
    emoji: "💡",
    blurb: "Quick value that builds trust and saves.",
    card: { title: "Buyer / Seller Tip", tagline: "Quick value that builds trust", gradient: "from-indigo-600 to-purple-700" },
    inputs: [
      { key: "topic", label: "Topic", placeholder: "First-time buyer mistakes" },
      { key: "angle", label: "Your angle", placeholder: "The one inspection line people skip", type: "textarea" },
    ],
  },
];

export type Plan = {
  id: string;
  name: string;
  price: number;
  videos: number;
  blurb: string;
  features: string[];
  featured?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 97,
    videos: 8,
    blurb: "Get posting consistently without the work.",
    features: [
      "8 avatar videos / month",
      "Photo avatar",
      "Standard video templates",
      "Full picture-post library",
      "Auto-scheduling to all socials",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 197,
    videos: 20,
    blurb: "A video of the real you, every time.",
    featured: true,
    features: [
      "20 avatar videos / month",
      "Digital twin of yourself",
      "All video types",
      "Full picture-post library",
      "Auto-scheduling + content calendar",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 397,
    videos: 30,
    blurb: "Maximum output, maximum polish.",
    features: [
      "30 avatar videos / month",
      "Digital twin of yourself",
      "Listing tours up to 2 min (2 credits)",
      "Auto captions + hashtags per platform",
      "Priority rendering",
    ],
  },
];

export type ContentStatus = "draft" | "rendering" | "ready" | "scheduled" | "posted";

export type ContentItem = {
  id: string;
  kind: "video" | "picture";
  title: string;
  typeLabel: string;
  status: ContentStatus;
  caption: string;
  createdAt: string;
  scheduledFor?: string;
  platforms: string[];
  thumb: string; // tailwind gradient classes for the prototype
};

export const LIBRARY: ContentItem[] = [
  {
    id: "c1",
    kind: "video",
    title: "Just Listed — 123 Maple Ave SW",
    typeLabel: "New Listing",
    status: "ready",
    caption:
      "Just listed in Altadore and it won't last. 4 bed, 3 bath, renovated kitchen, west-facing yard. DM me for a private showing. 🏡 #yycrealestate #calgaryhomes",
    createdAt: "2026-10-16T14:20:00Z",
    platforms: ["instagram", "facebook", "tiktok"],
    thumb: "from-brand to-brand-dark",
  },
  {
    id: "c2",
    kind: "picture",
    title: "Open House Sunday — 88 Riverstone",
    typeLabel: "Picture Post",
    status: "scheduled",
    caption: "Open house this Sunday 1–3 PM. Come see this riverside stunner in person. 📍",
    createdAt: "2026-10-15T10:00:00Z",
    scheduledFor: "2026-10-19T15:00:00Z",
    platforms: ["instagram", "facebook"],
    thumb: "from-emerald-500 to-teal-600",
  },
  {
    id: "c3",
    kind: "video",
    title: "Calgary Market Update — October",
    typeLabel: "Market Update",
    status: "posted",
    caption:
      "Calgary median price is up 4% month over month. Here's what that means if you're buying this fall. 📈",
    createdAt: "2026-10-10T09:00:00Z",
    scheduledFor: "2026-10-11T13:00:00Z",
    platforms: ["instagram", "youtube", "linkedin"],
    thumb: "from-indigo-500 to-purple-600",
  },
  {
    id: "c4",
    kind: "video",
    title: "Just Sold — Over Asking in 6 Days",
    typeLabel: "Just Sold",
    status: "draft",
    caption: "SOLD — over asking, multiple offers, 6 days on market. Thinking of selling? Let's talk.",
    createdAt: "2026-10-17T08:30:00Z",
    platforms: ["instagram", "facebook"],
    thumb: "from-amber-500 to-orange-600",
  },
];

export type SocialAccount = {
  platform: "instagram" | "facebook" | "tiktok" | "youtube" | "linkedin";
  handle: string;
  connected: boolean;
};

export const SOCIALS: SocialAccount[] = [
  { platform: "instagram", handle: "@newbuildguy", connected: true },
  { platform: "facebook", handle: "Peter Eki Realty", connected: true },
  { platform: "tiktok", handle: "@newbuildguy", connected: true },
  { platform: "youtube", handle: "Peter Eki", connected: false },
  { platform: "linkedin", handle: "Peter Eki", connected: false },
];

export const ACCOUNT = {
  name: "Peter Eki",
  brokerage: "lpt realty",
  plan: "Growth",
  niche: "New builds",
  creditsTotal: 20,
  creditsUsed: 7,
  approveBeforePosting: true,
  twinStatus: "ready" as "ready" | "training" | "none",
  brand: {
    primary: "#F5A622",
    secondary: "#1B5FAD",
    logoLabel: "PE",
  },
};

export function platformLabel(p: string) {
  return p.charAt(0).toUpperCase() + p.slice(1);
}

// ── Monday Drop: proactive weekly scripts (market + the agent's niche) ──
// The agent opens the app, approves, and we build + schedule automatically.
export type WeeklyScript = {
  id: string;
  tag: string;
  title: string;
  hook: string;
  caption: string;
};

export const WEEKLY_SCRIPTS: WeeklyScript[] = [
  {
    id: "w1",
    tag: "Market Update",
    title: "Calgary prices ticked up again this month",
    hook: "Calgary's market just shifted — here's what it means for you.",
    caption:
      "📈 Calgary's median price is up again month over month. Here's what buyers should do about it. DM me for your neighbourhood's numbers.",
  },
  {
    id: "w2",
    tag: "New Build",
    title: "Why new-build inventory is a buyer's edge right now",
    hook: "Everyone's fighting over resale homes — here's the smarter play.",
    caption:
      "🏗️ New builds mean more choice, warranties and fewer bidding wars. Here's how to shop them the right way. Message me to tour a few.",
  },
  {
    id: "w3",
    tag: "Buyer Tip",
    title: "The pre-approval mistake costing buyers thousands",
    hook: "This one pre-approval slip quietly costs buyers thousands.",
    caption:
      "💡 Getting pre-approved isn't the same as getting pre-approved right. Save this before you shop. Questions? DM me.",
  },
];
