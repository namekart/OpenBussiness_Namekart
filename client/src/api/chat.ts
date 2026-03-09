import { apiRequest } from "@/lib/queryClient";
import { api } from "@shared/routes";
import type { ChatSendRequestType } from "@shared/routes";

export type ChatSendResponse = {
  reply: string;
  sessionId: string;
  action?: { type: "navigate"; page: string };
};

export async function sendChatMessage(
  body: ChatSendRequestType
): Promise<ChatSendResponse> {
  const res = await apiRequest("POST", api.chat.send.path, body);
  return res.json();
}
