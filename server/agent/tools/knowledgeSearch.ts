import { ChromaClient } from "chromadb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const COLLECTION_NAME = "website_knowledge";
const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";
const RAG_TOP_K = Math.max(1, Math.min(20, parseInt(process.env.RAG_TOP_K || "5", 10)));

let _client: ChromaClient | null = null;
let _embeddings: GoogleGenerativeAIEmbeddings | null = null;

function getClient(): ChromaClient {
  if (!_client) _client = new ChromaClient({ path: CHROMA_URL });
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
    const client = getClient();
    const embeddings = getEmbeddings();
    const collection = await client.getOrCreateCollection({
      name: COLLECTION_NAME,
      metadata: { "hnsw:space": "cosine" },
    });

    const [queryEmbedding] = await embeddings.embedDocuments([query]);
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: RAG_TOP_K,
      include: ["documents", "metadatas"],
    });

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
