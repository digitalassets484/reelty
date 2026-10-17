// Client-safe mock services for render + picture (no secrets involved).
// Script generation now goes through the server route /api/script so the
// Claude API key stays on the server. Imports the mock classes DIRECTLY
// (not the server-only resolver) to keep server SDKs out of the client bundle.
import { MockHeyGen } from "./integrations/heygen";
import { MockPlacid } from "./integrations/placid";

const heygen = new MockHeyGen();
const placid = new MockPlacid();

export async function renderVideo(script: string, durationSec = 45) {
  const job = await heygen.render({ script, avatarId: "twin_default", durationSec });
  const done = await heygen.getJob(job.jobId);
  return { ...done, creditsUsed: job.creditsUsed };
}

export async function generatePicture(templateId: string, fields: Record<string, string>) {
  return placid.generate({ templateId, fields });
}
