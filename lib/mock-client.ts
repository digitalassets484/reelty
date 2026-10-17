// ─────────────────────────────────────────────────────────────
// Client-side mock services. These call the integration adapters
// directly (no network, no API routes), which keeps the app a pure
// static export that runs fully on GitHub Pages.
// Phase 2: swap these for real server actions / API calls.
// ─────────────────────────────────────────────────────────────
import {
  scriptProvider,
  videoProvider,
  pictureProvider,
} from "./integrations";
import { ACCOUNT } from "./mock-data";

export async function writeScript(videoType: string, inputs: Record<string, string>) {
  return scriptProvider.write({
    videoType,
    brokerage: ACCOUNT.brokerage,
    agentName: ACCOUNT.name,
    inputs,
  });
}

export async function renderVideo(script: string, durationSec = 45) {
  const job = await videoProvider.render({ script, avatarId: "twin_default", durationSec });
  const done = await videoProvider.getJob(job.jobId);
  return { ...done, creditsUsed: job.creditsUsed };
}

export async function generatePicture(templateId: string, fields: Record<string, string>) {
  return pictureProvider.generate({ templateId, fields });
}
