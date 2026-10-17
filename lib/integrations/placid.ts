import type { PictureProvider, PictureRequest, PictureResult } from "./types";

// MOCK Placid picture generator.
// Phase 2: POST field values to a Placid template; get back a finished
// on-brand image. ~1–2¢ per image, so picture posts stay near-unlimited.
// Templates are our rebuilt Canva designs, fields locked so layouts
// never break. No Editor SDK needed (fill-in-the-blanks only).
export class MockPlacid implements PictureProvider {
  async generate(req: PictureRequest): Promise<PictureResult> {
    await delay(700);
    return {
      imageUrl: `/mock/placid-${req.templateId}.png`,
      width: 1080,
      height: 1080,
    };
  }
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
