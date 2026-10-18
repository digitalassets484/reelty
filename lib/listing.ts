export type ParsedListing = {
  address?: string;
  price?: string;
  beds?: string;
  highlights?: string;
};

// Best-effort listing parser for a Realtor.ca / MLS URL.
// Many listing sites block scrapers, so this often returns little and the UI
// falls back to manual entry. Phase 2.5: a proper MLS/data-partner feed.
export async function parseListing(url: string): Promise<ParsedListing> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ReeltyBot/1.0)" },
      redirect: "follow",
    });
    if (!res.ok) return {};
    const html = await res.text();

    const price = html.match(/\$\s?\d{3}(?:,\d{3})+/)?.[0]?.replace(/\s/g, "");
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
    const address = title ? title.split(/[|–\-]/)[0].trim() : undefined;
    const bedsMatch = html.match(/(\d+)\s*(?:bed|bd|bedroom)/i);
    const beds = bedsMatch ? `${bedsMatch[1]} bed` : undefined;

    return { address, price, beds, highlights: "" };
  } catch {
    return {};
  }
}
