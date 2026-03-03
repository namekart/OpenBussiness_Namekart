import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { sendInquiryEmails } from "./mailer";

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

  return httpServer;
}
