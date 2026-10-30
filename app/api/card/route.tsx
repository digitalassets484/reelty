import { ImageResponse } from "next/og";

export const runtime = "edge";

// Free, in-house branded picture-post renderer (no Placid, no external API).
// Renders the agent's listing card to a 1080x1080 PNG from query params.
const GRAD: Record<string, [string, string]> = {
  "just-listed": ["#2F6BFF", "#1E4FD6"],
  "open-house": ["#10b981", "#0d9488"],
  "just-sold": ["#f59e0b", "#ea580c"],
  quote: ["#6366f1", "#9333ea"],
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const template = searchParams.get("template") || "just-listed";
  const [from, to] = GRAD[template] || GRAD["just-listed"];
  const tag = searchParams.get("tag") || "";
  const logo = searchParams.get("logo") || "PE";
  const agent = searchParams.get("agent") || "";
  const brokerage = searchParams.get("brokerage") || "";
  const l1 = searchParams.get("l1") || "";
  const l2 = searchParams.get("l2") || "";
  const l3 = searchParams.get("l3") || "";
  const photo = searchParams.get("photo") || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "white",
          fontFamily: "sans-serif",
          ...(photo
            ? { backgroundImage: `url(${photo})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }),
        }}
      >
        {photo ? (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(11,17,32,0.45)" }} />
        ) : null}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              width: 88,
              height: 88,
              borderRadius: 22,
              backgroundColor: "rgba(255,255,255,0.22)",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 42,
              fontWeight: 800,
            }}
          >
            {logo}
          </div>
          {tag ? (
            <div
              style={{
                display: "flex",
                padding: "14px 30px",
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.22)",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              {tag.toUpperCase()}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {l1 ? <div style={{ display: "flex", fontSize: 66, fontWeight: 800, lineHeight: 1.05 }}>{l1}</div> : null}
          {l2 ? <div style={{ display: "flex", fontSize: 96, fontWeight: 900, marginTop: 10 }}>{l2}</div> : null}
          {l3 ? <div style={{ display: "flex", fontSize: 38, fontWeight: 500, marginTop: 18, opacity: 0.92 }}>{l3}</div> : null}
        </div>

        <div style={{ display: "flex", fontSize: 32, fontWeight: 600, opacity: 0.92 }}>
          {agent}
          {brokerage ? ` · ${brokerage}` : ""}
        </div>
      </div>
    ),
    { width: 1080, height: 1080 },
  );
}
