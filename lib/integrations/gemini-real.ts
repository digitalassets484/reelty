import type { ImageGenProvider } from "./types";

// Google Gemini image generation (used when GEMINI_API_KEY is set — free tier).
// Returns a data: URL so the image can be stored/shown without separate hosting.
// Model + response shape per Google AI Studio's Gemini image API; verify when the
// key is added. Good for backgrounds/lifestyle art, NOT exact-text listing cards.
export class GeminiImageClient implements ImageGenProvider {
  constructor(private apiKey: string) {}

  async generate(prompt: string): Promise<{ imageUrl: string }> {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      },
    );
    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    for (const p of parts) {
      const inline = p.inlineData ?? p.inline_data;
      if (inline?.data) {
        const mime = inline.mimeType ?? inline.mime_type ?? "image/png";
        return { imageUrl: `data:${mime};base64,${inline.data}` };
      }
    }
    return { imageUrl: "" };
  }
}
