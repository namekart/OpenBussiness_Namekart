import { apiRequest } from "@/lib/queryClient";

export type ChatSendRequestType = {
  sessionId?: string;
  message: string;
};

export type ChatSendResponse = {
  reply: string;
  sessionId: string;
  action?: { type: "navigate"; page: string };
};

export async function sendChatMessage(
  body: ChatSendRequestType
): Promise<ChatSendResponse> {
  const res = await apiRequest("POST", "/api/chat", body);
  return res.json();
}
