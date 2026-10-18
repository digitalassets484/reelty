import type { PictureProvider, PictureRequest, PictureResult } from "./types";

// Real Placid picture generator (used when PLACID_API_TOKEN is set).
// Maps form fields to template layers; verify layer names per template when wired.
export class PlacidClient implements PictureProvider {
  constructor(private token: string) {}

  async generate(req: PictureRequest): Promise<PictureResult> {
    const layers: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(req.fields)) {
      layers[key] = { text: value };
    }
    if (req.photoUrl) layers["photo"] = { image: req.photoUrl };

    const res = await fetch("https://api.placid.app/api/rest/images", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ template_uuid: req.templateId, layers }),
    });
    const data = await res.json();
    return {
      imageUrl: data?.image_url ?? data?.polling_url ?? "",
      width: 1080,
      height: 1080,
    };
  }
}
