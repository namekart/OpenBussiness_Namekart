import { StateGraph, END } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { AgentState, type Intent } from "./state";
import { SYSTEM_PROMPT, INTENT_CLASSIFICATION_PROMPT } from "./prompts";
import { searchKnowledge } from "./tools/knowledgeSearch";
import { createNavigationAction } from "./tools/navigation";
import { captureLead } from "./tools/leadCapture";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-1.5-flash",
  temperature: 0.2,
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

async function intentNode(state: typeof AgentState.State): Promise<Partial<typeof AgentState.State>> {
  const text = getLastUserMessage(state);
  const response = await llm.invoke([
    new HumanMessage(INTENT_CLASSIFICATION_PROMPT + "\n\nUser: " + text),
  ]);
  const content = typeof response.content === "string" ? response.content : String(response.content ?? "");
  const intent = (content.toLowerCase().trim().replace(/\.$/, "") as Intent) || "general";
  const valid: Intent[] = ["knowledge", "navigation", "lead_capture", "general"];
  const resolved: Intent = valid.includes(intent) ? intent : "general";
  return { intent: resolved };
}

async function retrieveNode(state: typeof AgentState.State): Promise<Partial<typeof AgentState.State>> {
  const text = getLastUserMessage(state);
  const context = await searchKnowledge(text);
  return { context: context || undefined };
}

async function toolsNode(state: typeof AgentState.State): Promise<Partial<typeof AgentState.State>> {
  const intent = state.intent;
  const lastContent = getLastUserMessage(state);
  const results: Record<string, unknown> = {};
  let nextPage: string | undefined;
  let lead: { name: string; email: string; query: string } | undefined;

  if (intent === "navigation") {
    const page = extractPageFromMessage(lastContent);
    nextPage = page ?? "/";
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

  return { toolResults: results, nextPage, lead };
}

function extractPageFromMessage(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes("pricing")) return "/pricing";
  if (lower.includes("feature")) return "/features";
  if (lower.includes("crm")) return "/crm";
  if (lower.includes("erp")) return "/erp";
  if (lower.includes("ai voice") || lower.includes("ai-voice")) return "/ai-voice";
  if (lower.includes("setting")) return "/settings";
  const match = text.match(/\/(?:[\w-]+)/);
  return match ? match[0] : null;
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
  .addNode("intent", intentNode)
  .addNode("retrieve", retrieveNode)
  .addNode("tools", toolsNode)
  .addNode("generate", generateNode);

builder.addEdge("__start__", "intent");
builder.addConditionalEdges("intent", routeByIntent, {
  retrieve: "retrieve",
  tools: "tools",
  generate: "generate",
});
builder.addEdge("retrieve", "generate");
builder.addEdge("tools", "generate");
builder.addEdge("generate", END);

export const agentGraph = builder.compile();
