# AI Website Agent — Detailed Implementation Plan (TypeScript)

Production AI website agent using **LangGraph** + **Gemini** + **Chroma DB**, with a **TypeScript/Node.js** stack. All code and packages are JavaScript/TypeScript (no Python).

---

## Architecture Overview

```
User
 │
 ▼
Chat Widget (React / Vite)
 │
 ▼
Chat API (Express)
 │
 ▼
AI Agent (LangGraph + TypeScript)
 │
 ├── Intent detection
 ├── Knowledge retrieval (RAG)
 ├── Tool execution
 │
 ▼
Tools
 ├── Website knowledge search (Chroma)
 ├── Navigation tool
 ├── Lead capture
 ├── Email sender
 │
 ▼
Database
 ├── Chroma DB (Docker) — vector store
 ├── MongoDB — leads, chat logs
```

---

## Tech Stack (TypeScript Only)

| Layer        | Technology |
|-------------|------------|
| Frontend    | React, Vite, existing UI (shadcn, wouter) |
| Backend API | Express (existing `server/`) |
| Agent       | `@langchain/langgraph`, `@langchain/core` |
| LLM         | `@langchain/google-genai` (Gemini) |
| Vector DB   | Chroma (Docker) + `chromadb` npm client |
| Embeddings  | `@langchain/google-genai` embeddings or `@langchain/core/embeddings` |
| DB (leads)  | MongoDB (existing Mongoose) |

---

## Feature Flag: AI Chatbot

The AI chatbot is **feature-flagged** so you can show or hide it without code changes.

**Behaviour:**

- **Flag on** → Chat bubble is visible; `POST /api/chat` is active; agent runs.
- **Flag off** → Chat bubble is hidden; chat API returns 404 or 503 so the widget is never used.

**Implementation:**

| Where | How |
|-------|-----|
| **Backend** | Read `ENABLE_AI_CHATBOT` (or `FEATURE_AI_CHATBOT`) from env. Only register the chat route and agent when `true`. Optionally expose `GET /api/features` returning `{ aiChatbot: boolean }`. |
| **Frontend** | Call `GET /api/features` (or use a shared config) and render `ChatWidget` only when `aiChatbot === true`. |
| **Env** | `.env`: `ENABLE_AI_CHATBOT=true` or `false`. Default to `false` if unset so the feature is off until you enable it. |

**Backend (Express):**

- Create `server/config/features.ts` (or `server/features.ts`):  
  `export const features = { aiChatbot: process.env.ENABLE_AI_CHATBOT === "true" };`
- In route registration (e.g. `server/routes/index.ts`):  
  `if (features.aiChatbot) app.use("/api/chat", chatRouter);`
- Optional: `GET /api/features` returns `res.json({ aiChatbot: features.aiChatbot })` (no secrets).

**Frontend (React):**

- Fetch features once (e.g. in `App.tsx` or a layout) from `GET /api/features`.
- Store in React state or a small context (e.g. `FeaturesContext`).
- In the root layout or `App.tsx`:  
  `{features?.aiChatbot && <ChatWidget />}`  
  So the floating chat bubble and panel only mount when the flag is on.

**Checklist:**

- [ ] Add `ENABLE_AI_CHATBOT` to `.env.example` and doc (default `false`).
- [ ] Implement `server/config/features.ts` and conditional chat route registration.
- [ ] Add `GET /api/features` and frontend fetch; render `ChatWidget` only when `aiChatbot` is true.

---

## Step-by-Step Implementation Plan

---

### 1. Dependencies (TypeScript / Node)

Add to `package.json` (or run in project root):

```bash
npm install @langchain/langgraph @langchain/core @langchain/google-genai chromadb
npm install -D @types/node
```

**Packages:**

- `@langchain/langgraph` — agent graph (nodes, edges, state)
- `@langchain/core` — messages, runnables, base abstractions
- `@langchain/google-genai` — ChatGoogleGenerativeAI + embeddings for Gemini
- `chromadb` — Chroma client (talks to Chroma server in Docker)

---

### 2. Chroma DB in Docker

**2.1 Update `docker-compose.yml`**

Add a Chroma service (keep existing `web` service):

```yaml
services:
  chroma:
    image: chromadb/chroma:latest
    ports:
      - "8000:8000"
    volumes:
      - chroma_data:/chroma/chroma
    environment:
      - ALLOW_RESET=true
    restart: unless-stopped

  web:
    # ... existing web config ...
    environment:
      - CHROMA_URL=http://chroma:8000  # from same compose network
    depends_on:
      - chroma

volumes:
  chroma_data:
```

**2.2 Local dev (agent runs on host)**

- Run Chroma only: `docker compose up chroma -d`
- Set in `.env`: `CHROMA_URL=http://localhost:8000`

**2.3 Chroma client (TypeScript)**

- Use `chromadb` npm package; point `ChromaClient` at `process.env.CHROMA_URL`.

---

### 3. Project Structure (New Files)

Suggested layout under existing repo:

```
server/
  config/
    features.ts           # Feature flags (e.g. ENABLE_AI_CHATBOT)
  agent/
    index.ts              # Compile graph, runAgent()
    graph.ts              # LangGraph definition (nodes, edges, state)
    state.ts              # Agent state TypedDict/interface
    tools/
      knowledgeSearch.ts  # RAG tool (Chroma)
      navigation.ts       # Return { action: "navigate", page }
      leadCapture.ts      # Save lead to MongoDB
      emailNotify.ts      # Send email (reuse server/mailer)
    prompts.ts            # System prompt
  routes/
    chat.ts               # POST /api/chat (registered only if features.aiChatbot)
    features.ts           # GET /api/features (optional)
  ingest/
    crawlAndIngest.ts     # Optional: scrape site → chunks → Chroma
client/
  src/
    components/
      chat/
        ChatWidget.tsx    # Floating bubble + panel (mount only when feature on)
        ChatMessage.tsx
        ChatInput.tsx
    api/
      chat.ts             # POST /api/chat
      features.ts         # GET /api/features (for feature flag)
```

---

### 4. Agent State (TypeScript)

**File: `server/agent/state.ts`**

Define shared state for the graph (messages, tool results, intent, etc.):

```ts
import type { BaseMessage } from "@langchain/core/messages";

export interface AgentState {
  messages: BaseMessage[];
  intent?: "knowledge" | "navigation" | "lead_capture" | "general";
  context?: string;        // RAG context
  toolResults?: Record<string, unknown>;
  nextPage?: string;       // For navigation tool
  lead?: { name: string; email: string; query: string };
}
```

Use this type in the LangGraph `StateGraph` so every node reads/writes the same shape.

---

### 5. System Prompt

**File: `server/agent/prompts.ts`**

- Define a string constant (e.g. `SYSTEM_PROMPT`) that describes:
  - You are the Namekart AI assistant.
  - Explain website features, guide to pages, collect leads, answer product questions; be concise and friendly.
- Optionally add instructions on when to use which tool (knowledge vs navigate vs lead capture) so the model stays aligned with your intent logic.

---

### 6. Tools (TypeScript)

**6.1 Knowledge search (RAG) — `server/agent/tools/knowledgeSearch.ts`**

- Use `chromadb` to create/get a collection (e.g. `website_knowledge`).
- Use Gemini embeddings via `@langchain/google-genai` (or another LangChain embedding class that supports Gemini) to embed the user query.
- Query Chroma with that embedding; get top-k chunks (e.g. 4–5).
- Return concatenated text as “context” for the LLM.
- Expose this as a LangChain tool (e.g. `DynamicStructuredTool` or `tool()` from `@langchain/core/tools`) that the agent can call when intent is “knowledge” or when the model decides to search.

**6.2 Navigation — `server/agent/tools/navigation.ts`**

- Input: target page (e.g. `/pricing`, `/features`).
- Tool returns a structured object, e.g. `{ action: "navigate", page: "/pricing" }`.
- No direct DB call; the API layer will send this in the response so the frontend can call `router.push(result.page)`.

**6.3 Lead capture — `server/agent/tools/leadCapture.ts`**

- Input: name, email, query (from LLM or structured form).
- Save to MongoDB (reuse existing Mongoose models or create `Lead` model: name, email, query, createdAt).
- Return success/confirmation message for the agent to relay to the user.

**6.4 Email notification — `server/agent/tools/emailNotify.ts`**

- On successful lead capture, call existing `server/mailer.ts` to send “New Lead from Website AI” to team (and optionally a “We’ll reach out shortly” to the user).
- Can be invoked from the same node that does lead capture or from a separate “after_lead” node.

---

### 7. LangGraph Definition (TypeScript)

**File: `server/agent/graph.ts`**

- Use `StateGraph<AgentState>` from `@langchain/langgraph`.
- **Nodes:**
  - **intent**: Read last user message; call Gemini to classify intent (`knowledge` | `navigation` | `lead_capture` | `general`) and set `state.intent`.
  - **retrieve**: If intent is knowledge, call RAG tool (Chroma + embeddings), put result in `state.context`.
  - **tools**: Execute navigation / lead capture / email tools based on intent; write results into `state.toolResults`, `state.nextPage`, `state.lead`.
  - **generate**: Build prompt with system prompt + optional `state.context` + conversation `state.messages`; call Gemini; append assistant message to `state.messages`.
- **Edges:**
  - `intent` → `retrieve` (if knowledge) or `tools` (if navigation/lead) or `generate` (if general).
  - `retrieve` → `generate`.
  - `tools` → `generate`.
  - `generate` → END.
- Use conditional edges (e.g. `graph.addConditionalEdges("intent", routeByIntent)`) for routing.
- Compile with `graph.compile()` (and optionally a checkpointer like `MemorySaver` for multi-turn sessions).

---

### 8. Run Agent (TypeScript)

**File: `server/agent/index.ts`**

- Export `runAgent(sessionId: string, userMessage: string): Promise<AgentResponse>`.
- Inside:
  - Load or create state (e.g. from checkpointer by `sessionId`).
  - Invoke the compiled graph with `{ messages: [...existing, newHumanMessage] }`.
  - Read final state: `messages`, `nextPage`, `lead`, etc.
  - Return a DTO, e.g. `{ reply: string, action?: { type: "navigate", page: string } }` for the API.

---

### 9. Chat API (Express)

**File: `server/routes/chat.ts`**

- `POST /api/chat`
- Body: `{ sessionId?: string, message: string }`.
- Call `runAgent(sessionId ?? newSessionId(), message)`.
- Respond with:
  - `{ reply, action?: { type: "navigate", page: string } }`
- Register route in existing `server/routes` (or `registerRoutes`).

---

### 10. Chat Widget (React)

**Files: `client/src/components/chat/ChatWidget.tsx`, `ChatMessage.tsx`, `ChatInput.tsx`**

- **Feature flag**: Only render the chat UI when the AI chatbot feature is on (e.g. `features.aiChatbot` from `GET /api/features`). In `App.tsx` or layout: `{features?.aiChatbot && <ChatWidget />}`.
- **ChatWidget**: Floating bubble; click to open/close; inside: message list + `ChatInput` + send button.
- **ChatMessage**: Render one message (user vs assistant); if `message.action?.type === "navigate"`, call `router.push(message.action.page)` (e.g. wouter’s `useLocation`/navigate).
- **ChatInput**: Input + send; on send, `POST /api/chat` with current `sessionId` and message; append user message, then stream or append assistant reply and optional action.

Use existing UI (e.g. shadcn Card, ScrollArea, Button, Input) and existing `use-api` or fetch for `/api/chat`.

---

### 11. Knowledge Base (RAG) — Ingestion (TypeScript)

**Option A — Manual / script**

- **File: `server/ingest/crawlAndIngest.ts`** (or similar):
  - Define list of URLs (e.g. `/about`, `/features`, `/pricing`, `/docs`, `/faqs`).
  - Fetch HTML (e.g. `axios`/`fetch`), strip tags and extract text (e.g. `cheerio` or a simple regex).
  - Split text into chunks (e.g. `RecursiveCharacterTextSplitter` from `@langchain/textsplitters` if available in JS, or a simple sentence/paragraph splitter).
  - Generate embeddings with Gemini embeddings (same as in RAG tool).
  - Store in Chroma: `collection.add({ ids, embeddings, documents, metadatas })`.

**Option B — Reuse sitemap / static routes**

- If the app has static or SSR pages, you can point the ingest script at local or staging URLs and run the same pipeline.

Run this script when content changes (e.g. `npm run ingest`).

---

### 12. Conversation Memory (Optional)

- Use LangGraph checkpointer (`MemorySaver` or a custom one) keyed by `sessionId` so the graph state (including `messages`) persists across requests.
- Optionally also store in MongoDB for analytics: e.g. `ChatMessage` model (sessionId, role, message, timestamp); write after each turn from the API.

---

### 13. Environment Variables

- `ENABLE_AI_CHATBOT` — Feature flag: `true` to show and enable the chatbot, `false` or unset to hide it (default off).
- `GOOGLE_API_KEY` — Gemini (and embeddings if using Gemini for embeddings).
- `CHROMA_URL` — e.g. `http://localhost:8000` (dev) or `http://chroma:8000` (Docker).
- Existing: `MONGODB_URI`, `EMAIL_*`, `OWNER_EMAIL` for leads and mailer.

---

### 14. Implementation Order (Checklist)

1. [ ] **Feature flag**: Add `server/config/features.ts`, `ENABLE_AI_CHATBOT` in env, conditional chat route, and `GET /api/features`; frontend fetch and render `ChatWidget` only when `aiChatbot` is true.
2. [ ] Add npm packages and Chroma to Docker; run Chroma and verify `chromadb` client connects.
3. [ ] Define `AgentState` and system prompt; implement tools (knowledge, navigation, lead, email) in TypeScript.
4. [ ] Build LangGraph (nodes + conditional edges); compile and wire to Gemini.
5. [ ] Implement `runAgent()` and `POST /api/chat` (guarded by feature flag).
6. [ ] Ingest script: scrape → chunk → embed → Chroma; run once.
7. [ ] Chat widget: bubble, messages, input, send; handle `reply` and `action.navigate` (only mounted when feature on).
8. [ ] Optional: checkpointer + MongoDB chat log; then optional website crawler automation.

---

### 15. Optional Later (TypeScript)

- **Voice**: Browser Speech API (speech → text → `/api/chat` → text → TTS).
- **CRM**: Webhook or API call from lead-capture tool to HubSpot/Salesforce/Twenty.
- **Crawler**: Scheduled job that crawls site and re-runs ingest.

---

## Summary

- **Stack**: TypeScript only — Express, LangGraph, Gemini (`@langchain/google-genai`), Chroma (Docker + `chromadb` npm), MongoDB.
- **Flow**: User → Chat Widget → POST /api/chat → runAgent (LangGraph) → intent → RAG (Chroma) / tools (navigate, lead, email) → Gemini → reply + optional navigate.
- **Docs**: Prefer [LangChain JS Docs](https://docs.langchain.com/oss/javascript/langgraph) and [Chroma TypeScript reference](https://docs.trychroma.com/reference/typescript/) when writing code. All implementation in this plan is TypeScript/JavaScript; no Python.
