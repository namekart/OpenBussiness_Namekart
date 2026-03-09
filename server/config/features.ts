/**
 * Feature flags read from environment.
 * AI chatbot is off by default until ENABLE_AI_CHATBOT=true.
 */
export const features = {
  aiChatbot: process.env.ENABLE_AI_CHATBOT === "true",
};
