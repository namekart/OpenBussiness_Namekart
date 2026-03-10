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
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";
const COLLECTION_NAME = "website_knowledge";
const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 150;

const DEFAULT_URLS = [
  { url: "http://localhost:5000/", name: "home", sourceFile: "client/src/pages/Home.tsx" },
  { url: "http://localhost:5000/crm", name: "crm", sourceFile: "client/src/pages/CRMPage.tsx" },
  { url: "http://localhost:5000/erp", name: "erp", sourceFile: "client/src/pages/ERPPage.tsx" },
  { url: "http://localhost:5000/ai-voice", name: "ai-voice", sourceFile: "client/src/pages/AIVoicePage.tsx" },
  { url: "http://localhost:5000/settings", name: "settings", sourceFile: "client/src/pages/SettingsPage.tsx" },
];

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": "OpenBusiness-Ingest/1.0" } });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);
  $("script, style, nav, footer").remove();
  return $("body").text().replace(/\s+/g, " ").trim();
}

function extractStringsFromCode(code: string): string {
  const matches = code.match(/(["'`])(?:(?=(\\?))\2.)*?\1/g) ?? [];
  const cleaned = matches
    .map((m) => m.slice(1, -1).replace(/\s+/g, " ").trim())
    .filter((s) => s.length >= 20)
    .filter((s) => /[A-Za-z]/.test(s))
    .filter((s) => s.includes(" ") || s.includes(",") || s.includes("."));
  return cleaned.join("\n");
}

async function fetchFallbackTextFromSource(relativePath: string): Promise<string> {
  const full = resolve(process.cwd(), relativePath);
  const code = await readFile(full, "utf-8");
  return extractStringsFromCode(code);
}

function stableId(url: string, index: number): string {
  return `${url.replace(/[^a-z0-9]/gi, "_")}_${index}`;
}

function parseChromaUrl(urlString: string): { host: string; port: number; ssl: boolean } {
  const parsed = new URL(urlString);
  return {
    host: parsed.hostname,
    port: Number(parsed.port || (parsed.protocol === "https:" ? 443 : 80)),
    ssl: parsed.protocol === "https:",
  };
}

async function main() {
  if (!process.env.GOOGLE_API_KEY) {
    console.error("Set GOOGLE_API_KEY");
    process.exit(1);
  }

  const { host, port, ssl } = parseChromaUrl(CHROMA_URL);
  const client = new ChromaClient({ host, port, ssl });
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "text-embedding-004",
  });
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  });

  // Recreate collection to avoid stale schema (e.g. default-embed metadata)
  // from older runs that can break queries in newer setups.
  try {
    await client.deleteCollection({ name: COLLECTION_NAME });
  } catch {
    // Ignore if collection does not exist yet.
  }

  const collection = await client.getOrCreateCollection({
    name: COLLECTION_NAME,
    metadata: { "hnsw:space": "cosine" },
  });

  const urls = DEFAULT_URLS;
  const allIds: string[] = [];
  const allDocs: string[] = [];
  const allMetadatas: { source: string }[] = [];

  for (const { url, name, sourceFile } of urls) {
    try {
      let text = await fetchText(url);
      if (text.length < 200 && sourceFile) {
        const fallback = await fetchFallbackTextFromSource(sourceFile);
        if (fallback.length > 0) {
          text = fallback;
        }
      }
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

  try {
    const vectors = await embeddings.embedDocuments(allDocs);
    const validVectors = Array.isArray(vectors) && vectors.every((v) => Array.isArray(v) && v.length > 0);
    if (!validVectors) {
      throw new Error("Embedding provider returned one or more empty vectors.");
    }

    await collection.upsert({
      ids: allIds,
      documents: allDocs,
      metadatas: allMetadatas,
      embeddings: vectors,
    });
  } catch (embedErr) {
    // Fallback path: let Chroma embed documents using its configured embedder.
    console.warn("Embedding fallback to Chroma default embedder:", embedErr);
    await collection.upsert({
      ids: allIds,
      documents: allDocs,
      metadatas: allMetadatas,
    });
  }

  console.log(`Ingested ${allDocs.length} chunks into ${COLLECTION_NAME}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
