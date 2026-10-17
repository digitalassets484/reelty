import type { VideoProvider, RenderRequest, RenderJob } from "./types";

// MOCK HeyGen avatar renderer.
// Phase 2: POST to HeyGen's video generation API with the agent's
// digital-twin avatar id, poll the job, store the returned MP4.
// Cost basis ~$4 / 1080p minute → bill 1 credit per video ≤ 60s,
// 2 credits for a 2-minute listing tour.
//
// ⚠️ FLAG: HeyGen Digital Twin *creation* may be Enterprise/sales-led,
// not pay-as-you-go. Verify before letting agents self-onboard a twin;
// otherwise twin creation happens during the paid setup step.
export class MockHeyGen implements VideoProvider {
  async render(req: RenderRequest): Promise<RenderJob> {
    await delay(400);
    return {
      jobId: `hg_${Math.random().toString(36).slice(2, 10)}`,
      status: "rendering",
      progress: 0,
      creditsUsed: req.durationSec > 60 ? 2 : 1,
    };
  }

  async getJob(jobId: string): Promise<RenderJob> {
    await delay(300);
    // Prototype: report ready immediately on poll.
    return {
      jobId,
      status: "ready",
      progress: 100,
      videoUrl: "/mock/avatar-render.mp4",
      creditsUsed: 1,
    };
  }
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
