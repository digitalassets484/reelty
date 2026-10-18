// SERVER-ONLY resolver. Returns the real API-backed client when its key is
// present, otherwise the mock — so the app runs with zero keys and each
// integration goes live independently as keys arrive.
// Never import this from a client component: it pulls in server SDKs + secrets.
import { MockClaude } from "./claude";
import { MockHeyGen } from "./heygen";
import { MockPlacid } from "./placid";
import { MockGHL } from "./ghl";
import { ClaudeClient } from "./claude-real";
import { HeyGenClient } from "./heygen-real";
import { PlacidClient } from "./placid-real";
import { GHLClient } from "./ghl-real";
import type {
  ScriptProvider,
  VideoProvider,
  PictureProvider,
  SchedulerProvider,
} from "./types";

export const scriptProvider: ScriptProvider = process.env.ANTHROPIC_API_KEY
  ? new ClaudeClient(process.env.ANTHROPIC_API_KEY)
  : new MockClaude();

export const videoProvider: VideoProvider = process.env.HEYGEN_API_KEY
  ? new HeyGenClient(process.env.HEYGEN_API_KEY)
  : new MockHeyGen();

export const pictureProvider: PictureProvider = process.env.PLACID_API_TOKEN
  ? new PlacidClient(process.env.PLACID_API_TOKEN)
  : new MockPlacid();

export const schedulerProvider: SchedulerProvider =
  process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID
    ? new GHLClient(process.env.GHL_API_KEY, process.env.GHL_LOCATION_ID)
    : new MockGHL();

export * from "./types";
