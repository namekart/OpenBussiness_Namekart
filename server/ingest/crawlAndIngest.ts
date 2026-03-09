/**
 * Ingest script: fetch pages, extract text with cheerio, chunk with
 * RecursiveCharacterTextSplitter, embed with Gemini, store in Chroma.
 * Run with: npx tsx server/ingest/crawlAndIngest.ts
 * Requires: CHROMA_URL, GOOGLE_API_KEY in env; Chroma server running.
 */
import "dotenv/config";
import { ChromaClient } from "chromadb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import * as cheerio from "cheerio";

const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";
const COLLECTION_NAME = "website_knowledge";
const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 150;

const DEFAULT_URLS = [
  { url: "http://localhost:5000/", name: "home" },
  { url: "http://localhost:5000/crm", name: "crm" },
  { url: "http://localhost:5000/erp", name: "erp" },
  { url: "http://localhost:5000/ai-voice", name: "ai-voice" },
  { url: "http://localhost:5000/settings", name: "settings" },
];

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": "OpenBusiness-Ingest/1.0" } });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);
  $("script, style, nav, footer").remove();
  return $("body").text().replace(/\s+/g, " ").trim();
}

function stableId(url: string, index: number): string {
  return `${url.replace(/[^a-z0-9]/gi, "_")}_${index}`;
}

async function main() {
  if (!process.env.GOOGLE_API_KEY) {
    console.error("Set GOOGLE_API_KEY");
    process.exit(1);
  }

  const client = new ChromaClient({ path: CHROMA_URL });
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "text-embedding-004",
  });
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  });

  const collection = await client.getOrCreateCollection({
    name: COLLECTION_NAME,
    metadata: { "hnsw:space": "cosine" },
  });

  const urls = DEFAULT_URLS;
  const allIds: string[] = [];
  const allDocs: string[] = [];
  const allMetadatas: { source: string }[] = [];

  for (const { url, name } of urls) {
    try {
      const text = await fetchText(url);
      const chunks = await splitter.splitText(text);
      for (let i = 0; i < chunks.length; i++) {
        allIds.push(stableId(url, i));
        allDocs.push(chunks[i]);
        allMetadatas.push({ source: url });
      }
      console.log(`  ${name}: ${chunks.length} chunks`);
    } catch (err) {
      console.warn(`  ${name} failed:`, err);
    }
  }

  if (allDocs.length === 0) {
    console.log("No documents to ingest.");
    process.exit(0);
  }

  const vectors = await embeddings.embedDocuments(allDocs);
  await collection.upsert({
    ids: allIds,
    documents: allDocs,
    metadatas: allMetadatas,
    embeddings: vectors,
  });

  console.log(`Ingested ${allDocs.length} chunks into ${COLLECTION_NAME}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
