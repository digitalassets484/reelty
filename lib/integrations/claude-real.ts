import Anthropic from "@anthropic-ai/sdk";
import type { ScriptProvider, ScriptRequest, ScriptResult } from "./types";

// Real Claude script writer. Used when ANTHROPIC_API_KEY is set.
// Haiku keeps script generation at pennies, so rewrites stay free for agents.
const MODEL = "claude-haiku-5-5";

const SYSTEM = `You write short-form social video scripts for a real estate agent.
Voice: warm, confident, concrete, never cheesy or salesy. The script must be
speakable in 20-40 seconds. The caption is platform-ready with 1-2 emojis and a
soft call to action. Always include a brokerage disclosure line.
Return ONLY valid minified JSON (no markdown fences) with keys:
hook (string), script (string), caption (string), hashtags (string array of 3-5),
disclosure (string).`;

export class ClaudeClient implements ScriptProvider {
  private client: Anthropic;
  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async write(req: ScriptRequest): Promise<ScriptResult> {
    const msg = await this.client.messages.create({
      model: MODEL,
      max_tokens: 900,
      system: SYSTEM,
      messages: [{ role: "user", content: buildUserPrompt(req) }],
    });

    const text = msg.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("")
      .trim();

    const json = extractJson(text);
    const fallbackDisclosure = `${req.agentName}, ${req.brokerage}. Not intended to solicit properties already listed.`;

    return {
      hook: str(json.hook),
      script: str(json.script),
      caption: str(json.caption),
      hashtags: Array.isArray(json.hashtags) ? json.hashtags.map(String) : [],
      disclosure: str(json.disclosure) || fallbackDisclosure,
    };
  }
}

function buildUserPrompt(req: ScriptRequest): string {
  const details = Object.entries(req.inputs)
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n");

  return `Agent: ${req.agentName} (${req.brokerage}), Calgary, Alberta.
Video type: ${req.videoType}
Details:
${details || "(none provided)"}

Write the hook, the spoken script, a caption, hashtags, and the disclosure.`;
}

function extractJson(text: string): Record<string, unknown> {
  try {
    return JSON.parse(text);
  } catch {
    const m = text.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch {
        /* fall through */
      }
    }
    return {};
  }
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}
