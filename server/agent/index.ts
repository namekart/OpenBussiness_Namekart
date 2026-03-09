import { HumanMessage } from "@langchain/core/messages";
import { agentGraph } from "./graph";

const AGENT_TIMEOUT_MS = 30_000;

export interface AgentResponse {
  reply: string;
  action?: { type: "navigate"; page: string };
}

/**
 * Run the agent for one user message. Returns the assistant reply and optional navigation action.
 * Session state is not persisted (no checkpointer) for v1; each call is effectively stateless
 * except for the single turn we invoke.
 */
export async function runAgent(
  _sessionId: string,
  userMessage: string
): Promise<AgentResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AGENT_TIMEOUT_MS);

  try {
    const result = await agentGraph.invoke(
      {
        messages: [new HumanMessage(userMessage)],
      },
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    const messages = result?.messages ?? [];
    const lastAi = [...messages].reverse().find(
      (m) => m._getType?.() === "ai" || (m as any).constructor?.name === "AIMessage"
    );
    const reply =
      lastAi && typeof lastAi.content === "string"
        ? lastAi.content
        : String(lastAi?.content ?? "Sorry, I couldn't generate a response.");

    const nextPage = result?.nextPage;
    const action =
      nextPage != null ? { type: "navigate" as const, page: nextPage } : undefined;

    return { reply, action };
  } catch (err) {
    clearTimeout(timeout);
    if ((err as Error).name === "AbortError") {
      return { reply: "The request took too long. Please try again." };
    }
    console.error("[agent] runAgent error:", err);
    return { reply: "Something went wrong. Please try again later." };
  }
}
