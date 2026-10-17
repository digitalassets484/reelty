import { MockClaude } from "./claude";
import { MockHeyGen } from "./heygen";
import { MockPlacid } from "./placid";
import { MockGHL } from "./ghl";
import type {
  ScriptProvider,
  VideoProvider,
  PictureProvider,
  SchedulerProvider,
} from "./types";

// Single place the app resolves its providers.
// Phase 2: switch on an env flag to return the real API-backed clients.
//   const live = process.env.REELTY_LIVE === "true";
//   export const scriptProvider = live ? new ClaudeClient(...) : new MockClaude();
export const scriptProvider: ScriptProvider = new MockClaude();
export const videoProvider: VideoProvider = new MockHeyGen();
export const pictureProvider: PictureProvider = new MockPlacid();
export const schedulerProvider: SchedulerProvider = new MockGHL();

export * from "./types";
