import { ChromaClient } from "chromadb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const COLLECTION_NAME = "website_knowledge";
const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";
const RAG_TOP_K = Math.max(1, Math.min(20, parseInt(process.env.RAG_TOP_K || "5", 10)));

let _client: ChromaClient | null = null;
let _embeddings: GoogleGenerativeAIEmbeddings | null = null;

function parseChromaUrl(urlString: string): { host: string; port: number; ssl: boolean } {
  const parsed = new URL(urlString);
  return {
    host: parsed.hostname,
    port: Number(parsed.port || (parsed.protocol === "https:" ? 443 : 80)),
    ssl: parsed.protocol === "https:",
  };
}

function getClient(): ChromaClient {
  if (!_client) {
    const { host, port, ssl } = parseChromaUrl(CHROMA_URL);
    _client = new ChromaClient({ host, port, ssl });
  }
  return _client;
}

function getEmbeddings(): GoogleGenerativeAIEmbeddings {
  if (!_embeddings) {
    _embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "text-embedding-004",
    });
  }
  return _embeddings;
}

/**
 * RAG: embed query, search Chroma, return concatenated context.
 * On Chroma/embedding errors returns fallback message so the agent can still reply.
 */
export async function searchKnowledge(query: string): Promise<string> {
  try {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      return "";
    }

    const client = getClient();
    const embeddings = getEmbeddings();
    const collection = await client.getCollection({ name: COLLECTION_NAME });

    let results;
    try {
      const queryEmbedding =
        typeof embeddings.embedQuery === "function"
          ? await embeddings.embedQuery(normalizedQuery)
          : (await embeddings.embedDocuments([normalizedQuery]))[0];

      if (!Array.isArray(queryEmbedding) || queryEmbedding.length === 0) {
        throw new Error("Empty query embedding from embedding provider");
      }

      results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: RAG_TOP_K,
        include: ["documents", "metadatas"],
      });
    } catch (embedErr) {
      // Fallback to Chroma-side embedding if external embedding returns empty.
      console.warn("[RAG] Falling back to queryTexts:", embedErr);
      results = await collection.query({
        queryTexts: [normalizedQuery],
        nResults: RAG_TOP_K,
        include: ["documents", "metadatas"],
      });
    }

    const documents = results.documents?.[0] ?? [];
    if (documents.length === 0) {
      return "";
    }
    return documents.join("\n\n").trim();
  } catch (err) {
    console.error("[RAG] knowledge search error:", err);
    return "[Knowledge search is temporarily unavailable. Answer from general knowledge.]";
  }
}
