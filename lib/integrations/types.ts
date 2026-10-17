// ─────────────────────────────────────────────────────────────
// Integration contracts.
// Every external service (Claude, HeyGen, Placid, GHL) is reached
// ONLY through one of these interfaces. The prototype ships mock
// implementations; Phase 2 swaps in real API-backed ones without
// touching the UI or API routes.
// ─────────────────────────────────────────────────────────────

export interface ScriptRequest {
  videoType: string;
  brokerage: string;
  agentName: string;
  inputs: Record<string, string>;
}

export interface ScriptResult {
  hook: string;
  script: string;
  caption: string;
  hashtags: string[];
  disclosure: string; // brokerage compliance line, baked in
}

export interface RenderRequest {
  script: string;
  avatarId: string; // digital twin or photo avatar
  durationSec: number;
}

export interface RenderJob {
  jobId: string;
  status: "queued" | "rendering" | "ready" | "failed";
  progress: number; // 0..100
  videoUrl?: string;
  creditsUsed: number;
}

export interface PictureRequest {
  templateId: string;
  fields: Record<string, string>;
  photoUrl?: string;
}

export interface PictureResult {
  imageUrl: string;
  width: number;
  height: number;
}

export interface ScheduleRequest {
  contentId: string;
  caption: string;
  platforms: string[];
  scheduledFor: string; // ISO
  requireApproval: boolean;
}

export interface ScheduleResult {
  scheduleId: string;
  status: "pending-approval" | "scheduled";
  platforms: string[];
  scheduledFor: string;
}

// The four provider ports the app depends on.
export interface ScriptProvider {
  write(req: ScriptRequest): Promise<ScriptResult>;
}
export interface VideoProvider {
  render(req: RenderRequest): Promise<RenderJob>;
  getJob(jobId: string): Promise<RenderJob>;
}
export interface PictureProvider {
  generate(req: PictureRequest): Promise<PictureResult>;
}
export interface SchedulerProvider {
  schedule(req: ScheduleRequest): Promise<ScheduleResult>;
}
