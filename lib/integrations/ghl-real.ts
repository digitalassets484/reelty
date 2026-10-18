import type { SchedulerProvider, ScheduleRequest, ScheduleResult } from "./types";

// Real GoHighLevel scheduler (used when GHL_API_KEY + GHL_LOCATION_ID are set).
// Account-agnostic by design: the agency API key + sub-account (location) id come
// from env, so switching from a partner agency to Peter's own agency later is a
// config change only. Posts land in the sub-account's Social Planner; with
// "approve before posting" on, they go in as drafts awaiting the agent's OK.
export class GHLClient implements SchedulerProvider {
  constructor(private apiKey: string, private locationId: string) {}

  async schedule(req: ScheduleRequest): Promise<ScheduleResult> {
    const res = await fetch(
      `https://services.leadconnectorhq.com/social-media-posting/${this.locationId}/posts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Version: "2021-07-28",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          type: "post",
          accountIds: [], // resolved from the agent's connected accounts when wired
          summary: req.caption,
          scheduleDate: req.scheduledFor,
          status: req.requireApproval ? "draft" : "scheduled",
        }),
      },
    );
    const data = await res.json();
    return {
      scheduleId: data?.id ?? data?._id ?? "",
      status: req.requireApproval ? "pending-approval" : "scheduled",
      platforms: req.platforms,
      scheduledFor: req.scheduledFor,
    };
  }
}
