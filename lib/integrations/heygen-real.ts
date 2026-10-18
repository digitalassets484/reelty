import type { VideoProvider, RenderRequest, RenderJob } from "./types";

// Real HeyGen avatar renderer (used when HEYGEN_API_KEY is set).
// Endpoints/shape reflect HeyGen's v2 generate + status API; verify against the
// current docs when the key is added, and wire a per-agent voice_id.
// ⚠️ Digital Twin *creation* may be Enterprise-tier — confirm before self-serve.
export class HeyGenClient implements VideoProvider {
  constructor(private apiKey: string) {}

  async render(req: RenderRequest): Promise<RenderJob> {
    const res = await fetch("https://api.heygen.com/v2/video/generate", {
      method: "POST",
      headers: { "X-Api-Key": this.apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        video_inputs: [
          {
            character: { type: "avatar", avatar_id: req.avatarId },
            voice: { type: "text", input_text: req.script },
          },
        ],
        dimension: { width: 1080, height: 1920 },
      }),
    });
    const data = await res.json();
    const jobId = data?.data?.video_id ?? data?.video_id ?? "";
    return { jobId, status: "rendering", progress: 0, creditsUsed: req.durationSec > 60 ? 2 : 1 };
  }

  async getJob(jobId: string): Promise<RenderJob> {
    const res = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${encodeURIComponent(jobId)}`, {
      headers: { "X-Api-Key": this.apiKey },
    });
    const data = await res.json();
    const s = data?.data?.status;
    const status = s === "completed" ? "ready" : s === "failed" ? "failed" : "rendering";
    return {
      jobId,
      status,
      progress: status === "ready" ? 100 : 50,
      videoUrl: data?.data?.video_url,
      creditsUsed: 1,
    };
  }
}
