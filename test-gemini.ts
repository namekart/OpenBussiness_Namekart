import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

async function test() {
  console.log("Starting Gemini test with model:", process.env.GOOGLE_MODEL || "gemini-2.5-flash");
  try {
    const llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: process.env.GOOGLE_MODEL || "gemini-2.5-flash",
      maxRetries: 1,
    });
    console.log("Sending request...");
    const t0 = Date.now();
    
    // Add a local timeout to the test
    const response = await Promise.race([
      llm.invoke("Hello, are you there?"),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout after 10s")), 10000))
    ]);
    
    console.log("Response received in", Date.now() - t0, "ms");
    console.log(response);
  } catch (err) {
    console.error("Error during Gemini call:");
    console.error(err);
  }
}

test();
