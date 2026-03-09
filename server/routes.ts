import type { Express } from "express";
import type { Server } from "http";
import { nanoid } from "nanoid";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { sendInquiryEmails } from "./mailer";
import { features } from "./config/features";
import { runAgent } from "./agent";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);

      let user = await storage.getUserByEmail(input.email);
      if (!user) {
        // For demo purposes, we automatically create an account if it doesn't exist.
        user = await storage.createUser({
          name: input.email.split('@')[0],
          email: input.email,
          password: input.password
        });
      } else if (user.password !== input.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.status(200).json({ message: "Login successful", token: "demo-jwt-token" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.inquiries.create.path, async (req, res) => {
    try {
      const input = api.inquiries.create.input.parse(req.body);
      const inquiry = await storage.createInquiry(input);

      // Send emails (auto-reply to user + notification to owner)
      // Run async so it doesn't block the response
      sendInquiryEmails(input.name, input.email, input.message).catch((err) => {
        console.error("Failed to send inquiry emails:", err);
      });

      res.status(201).json(inquiry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // --- Features (AI chatbot flag) ---
  app.get(api.features.get.path, (_req, res) => {
    res.status(200).json({ aiChatbot: features.aiChatbot });
  });

  // --- Chat (guarded by feature flag; 503 when off) ---
  const chatRateLimit = new Map<string, { count: number; resetAt: number }>();
  const CHAT_RATE_LIMIT_WINDOW_MS = 60_000;
  const CHAT_RATE_LIMIT_MAX = 30;

  app.post(api.chat.send.path, async (req, res) => {
    if (!features.aiChatbot) {
      return res.status(503).json({ message: "Chat is not available" });
    }

    const key = (req.body?.sessionId as string) || req.ip || req.socket?.remoteAddress || "unknown";
    const now = Date.now();
    const entry = chatRateLimit.get(key);
    if (entry) {
      if (now > entry.resetAt) {
        chatRateLimit.set(key, { count: 1, resetAt: now + CHAT_RATE_LIMIT_WINDOW_MS });
      } else if (entry.count >= CHAT_RATE_LIMIT_MAX) {
        return res.status(429).json({ message: "Too many messages. Please try again later." });
      } else {
        entry.count += 1;
      }
    } else {
      chatRateLimit.set(key, { count: 1, resetAt: now + CHAT_RATE_LIMIT_WINDOW_MS });
    }

    try {
      const input = api.chat.send.input.parse(req.body);
      const sessionId = input.sessionId ?? nanoid();
      const { reply, action } = await runAgent(sessionId, input.message);
      res.status(200).json({ reply, sessionId, action });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
