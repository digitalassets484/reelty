// SERVER-ONLY resolver. Returns the real API-backed client when its key is
// present, otherwise the mock — so the app runs with zero keys and each
// integration goes live independently as keys arrive.
// Never import this from a client component: it pulls in server SDKs + secrets.
import { MockClaude } from "./claude";
import { MockHeyGen } from "./heygen";
import { MockPlacid } from "./placid";
import { MockGHL } from "./ghl";
import { ClaudeClient } from "./claude-real";
import type {
  ScriptProvider,
  VideoProvider,
  PictureProvider,
  SchedulerProvider,
} from "./types";

export const scriptProvider: ScriptProvider = process.env.ANTHROPIC_API_KEY
  ? new ClaudeClient(process.env.ANTHROPIC_API_KEY)
  : new MockClaude();

// Real HeyGen / Placid / GHL clients land in later increments (env-gated here).
export const videoProvider: VideoProvider = new MockHeyGen();
export const pictureProvider: PictureProvider = new MockPlacid();
export const schedulerProvider: SchedulerProvider = new MockGHL();

export * from "./types";
