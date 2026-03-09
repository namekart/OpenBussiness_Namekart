import { z } from 'zod';
import { insertInquirySchema, loginSchema, type InquiryType } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: loginSchema,
      responses: {
        200: z.object({ message: z.string(), token: z.string().optional() }),
        401: errorSchemas.unauthorized,
        400: errorSchemas.validation,
      }
    }
  },
  inquiries: {
    create: {
      method: 'POST' as const,
      path: '/api/inquiry' as const,
      input: insertInquirySchema,
      responses: {
        201: z.custom<InquiryType>(),
        400: errorSchemas.validation,
      }
    }
  },
  features: {
    get: {
      method: 'GET' as const,
      path: '/api/features' as const,
      responses: {
        200: z.object({ aiChatbot: z.boolean() }),
      }
    }
  },
  chat: {
    send: {
      method: 'POST' as const,
      path: '/api/chat' as const,
      input: z.object({
        sessionId: z.string().optional(),
        message: z.string().min(1, 'Message is required').max(2000, 'Message too long'),
      }),
      responses: {
        200: z.object({
          reply: z.string(),
          sessionId: z.string(),
          action: z.object({ type: z.literal('navigate'), page: z.string() }).optional(),
        }),
        503: z.object({ message: z.string() }),
        400: errorSchemas.validation,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type LoginRequestType = z.infer<typeof api.auth.login.input>;
export type InquiryRequestType = z.infer<typeof api.inquiries.create.input>;
export type ChatSendRequestType = z.infer<typeof api.chat.send.input>;
