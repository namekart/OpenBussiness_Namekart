import type { BaseMessage } from "@langchain/core/messages";
import { Annotation, messagesStateReducer } from "@langchain/langgraph";

export type Intent = "knowledge" | "navigation" | "lead_capture" | "general";

/**
 * Agent state for the LangGraph. Uses reducer for messages so nodes append
 * without overwriting. Other fields are optional and set by nodes.
 */
export const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
  intent: Annotation<Intent | undefined>({
    default: () => undefined,
  }),
  context: Annotation<string | undefined>({
    default: () => undefined,
  }),
  toolResults: Annotation<Record<string, unknown> | undefined>({
    default: () => undefined,
  }),
  nextPage: Annotation<string | undefined>({
    default: () => undefined,
  }),
  lead: Annotation<{ name: string; email: string; query: string } | undefined>({
    default: () => undefined,
  }),
});

export type AgentStateType = typeof AgentState.State;
