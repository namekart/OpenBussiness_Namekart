import { StateGraph, END } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { AgentState, type Intent } from "./state";
import { SYSTEM_PROMPT } from "./prompts";
import { searchKnowledge } from "./tools/knowledgeSearch";
import { createNavigationAction } from "./tools/navigation";
import { captureLead } from "./tools/leadCapture";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: process.env.GOOGLE_MODEL || "gemini-3-flash-preview",
  temperature: 0.3,
  maxOutputTokens: 8192,
  maxRetries: 0, // Fail fast on quota limits instead of hanging for 60s
});

function getLastUserMessage(state: typeof AgentState.State): string {
  const messages = state.messages ?? [];
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m._getType?.() === "human" || (m as any).constructor?.name === "HumanMessage") {
      return typeof m.content === "string" ? m.content : String(m.content);
    }
  }
  return "";
}

const NAV_KEYWORDS: [RegExp, string][] = [
  [/\bpricing\b/i, "/pricing"],
  [/\bfeatures?\b/i, "/features"],
  [/\bcrm\b/i, "/crm"],
  [/\berp\b/i, "/erp"],
  [/\bai[- ]?voice\b/i, "/ai-voice"],
  [/\bsettings?\b/i, "/settings"],
  [/\bhome\b/i, "/"],
];

const LEAD_SIGNALS = /\b(contact|callback|call me|reach out|get in touch|talk to (sales|support|team)|demo|inquiry|interested)\b/i;
const KNOWLEDGE_SIGNALS = /\b(what|how|why|explain|tell me|does|can|pricing|cost|plan|feature|product|service|work|offer|support|help)\b/i;

/**
 * Instant intent classification via keywords — no LLM call needed.
 * This saves 10-15s per request vs the previous LLM-based approach.
 */
async function classifyIntentNode(state: typeof AgentState.State): Promise<Partial<typeof AgentState.State>> {
  const t0 = Date.now();
  const text = getLastUserMessage(state);
  const lower = text.toLowerCase();

  const emailMatch = text.match(/[\w.+%-]+@[\w.-]+\.\w+/);
  if (emailMatch || LEAD_SIGNALS.test(lower)) {
    console.log(`[agent] classifyIntent: lead_capture (${Date.now() - t0}ms)`);
    return { intent: "lead_capture" };
  }

  for (const [regex, page] of NAV_KEYWORDS) {
    if (regex.test(lower) && /\b(go|show|take|open|navigate|visit|see|page)\b/i.test(lower)) {
      console.log(`[agent] classifyIntent: navigation → ${page} (${Date.now() - t0}ms)`);
      return { intent: "navigation" };
    }
  }

  if (KNOWLEDGE_SIGNALS.test(lower)) {
    console.log(`[agent] classifyIntent: knowledge (${Date.now() - t0}ms)`);
    return { intent: "knowledge" };
  }

  console.log(`[agent] classifyIntent: general (${Date.now() - t0}ms)`);
  return { intent: "general" };
}

const RAG_TIMEOUT_MS = 8_000;

async function retrieveNode(state: typeof AgentState.State): Promise<Partial<typeof AgentState.State>> {
  const t0 = Date.now();
  const text = getLastUserMessage(state);
  try {
    const context = await Promise.race([
      searchKnowledge(text),
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error("RAG timeout")), RAG_TIMEOUT_MS)
      ),
    ]);
    console.log(`[agent] retrieve: ${context.length} chars (${Date.now() - t0}ms)`);
    return { context: context || undefined };
  } catch (err) {
    console.warn(`[agent] retrieve failed/timeout (${Date.now() - t0}ms):`, err);
    return { context: undefined };
  }
}

async function toolsNode(state: typeof AgentState.State): Promise<Partial<typeof AgentState.State>> {
  const t0 = Date.now();
  const intent = state.intent;
  const lastContent = getLastUserMessage(state);
  const results: Record<string, unknown> = {};
  let nextPage: string | undefined;
  let lead: { name: string; email: string; query: string } | undefined;

  if (intent === "navigation") {
    for (const [regex, page] of NAV_KEYWORDS) {
      if (regex.test(lastContent)) {
        nextPage = page;
        break;
      }
    }
    nextPage = nextPage ?? "/";
    results.navigation = createNavigationAction(nextPage);
  }

  if (intent === "lead_capture") {
    const extracted = extractLeadFromMessage(lastContent);
    if (extracted) {
      const msg = await captureLead(extracted.name, extracted.email, extracted.query);
      lead = extracted;
      results.leadCapture = msg;
    } else {
      results.leadCapture = "I'd be happy to pass your details to the team. Could you share your name, email, and how we can help?";
    }
  }

  console.log(`[agent] tools: ${intent} (${Date.now() - t0}ms)`);
  return { toolResults: results, nextPage, lead };
}

function extractLeadFromMessage(text: string): { name: string; email: string; query: string } | null {
  const emailMatch = text.match(/[\w.+%-]+@[\w.-]+\.\w+/);
  if (!emailMatch) return null;
  const email = emailMatch[0];
  const nameMatch = text.match(/(?:name|my name|i'm|i am)[:\s]+([^\n,]+)/i) || text.match(/^([A-Za-z\s]+?)(?:\s+[\w.+%-]+@)/);
  const name = (nameMatch ? nameMatch[1].trim() : "Visitor") || "Visitor";
  const query = text.replace(email, "").replace(name, "").replace(/name|email|query/gi, "").trim() || "Inquiry from AI chat";
  return { name, email, query };
}

async function generateNode(state: typeof AgentState.State): Promise<Partial<typeof AgentState.State>> {
  const t0 = Date.now();
  let system = SYSTEM_PROMPT;
  if (state.context) {
    system += "\n\nRelevant context from our website:\n" + state.context;
  }
  const toolResults = state.toolResults;
  if (toolResults?.leadCapture && typeof toolResults.leadCapture === "string") {
    system += "\n\nUse this confirmation to the user (they just submitted their details): " + toolResults.leadCapture;
  }
  if (state.nextPage) {
    system += "\n\nYou suggested navigating to " + state.nextPage + ". Be brief and confirm you're directing them there.";
  }
  const messages = state.messages ?? [];
  const fullMessages = [new SystemMessage(system), ...messages];

  const response = await llm.invoke(fullMessages);
  const content = typeof response.content === "string" ? response.content : String(response.content ?? "");
  console.log(`[agent] generate: ${content.length} chars (${Date.now() - t0}ms)`);
  return { messages: [new AIMessage(content)] };
}

function routeByIntent(state: typeof AgentState.State): "retrieve" | "tools" | "generate" {
  switch (state.intent) {
    case "knowledge":
      return "retrieve";
    case "navigation":
    case "lead_capture":
      return "tools";
    default:
      return "generate";
  }
}

const builder = new StateGraph(AgentState)
  .addNode("classifyIntent", classifyIntentNode)
  .addNode("retrieve", retrieveNode)
  .addNode("tools", toolsNode)
  .addNode("generate", generateNode);

builder.addEdge("__start__", "classifyIntent");
builder.addConditionalEdges("classifyIntent", routeByIntent, {
  retrieve: "retrieve",
  tools: "tools",
  generate: "generate",
});
builder.addEdge("retrieve", "generate");
builder.addEdge("tools", "generate");
builder.addEdge("generate", END);

export const agentGraph = builder.compile();
