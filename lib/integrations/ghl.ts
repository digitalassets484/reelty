import type { SchedulerProvider, ScheduleRequest, ScheduleResult } from "./types";

// MOCK GoHighLevel scheduler.
// Phase 2: push the finished asset + caption into the agent's GHL
// sub-account Social Planner (GHL SaaS mode — one sub-account per agent).
// If "approve before posting" is on (default), it lands pending approval
// instead of going straight to the queue — the real-estate compliance guard.
export class MockGHL implements SchedulerProvider {
  async schedule(req: ScheduleRequest): Promise<ScheduleResult> {
    await delay(500);
    return {
      scheduleId: `ghl_${Math.random().toString(36).slice(2, 10)}`,
      status: req.requireApproval ? "pending-approval" : "scheduled",
      platforms: req.platforms,
      scheduledFor: req.scheduledFor,
    };
  }
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
