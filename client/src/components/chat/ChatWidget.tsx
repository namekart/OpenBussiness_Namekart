import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { ChatMessage, type ChatMessageData } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { sendChatMessage } from "@/api/chat";
import { cn } from "@/lib/utils";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSend = useCallback(
    async (text: string) => {
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setLoading(true);
      try {
        const res = await sendChatMessage({
          sessionId: sessionId ?? undefined,
          message: text,
        });
        setSessionId(res.sessionId);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.reply,
            action: res.action,
          },
        ]);
        if (res.action?.type === "navigate") {
          setLocation(res.action.page);
        }
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: err instanceof Error ? err.message : "Something went wrong. Please try again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [sessionId, setLocation]
  );

  const handleNavigate = useCallback(
    (page: string) => {
      setLocation(page);
      setOpen(false);
    },
    [setLocation]
  );

  return (
    <>
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {open && (
        <Card
          className={cn(
            "fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[480px] z-50 flex flex-col shadow-xl"
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4 border-b border-border">
            <h3 className="font-semibold text-sm">AI Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col p-0 min-h-0">
            <ScrollArea className="flex-1 px-3 py-2">
              <div className="flex flex-col gap-3">
                {messages.length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    Hi! Ask me about our product, pricing, or how we can help.
                  </p>
                )}
                {messages.map((msg, i) => (
                  <ChatMessage
                    key={i}
                    message={msg}
                    onNavigate={handleNavigate}
                  />
                ))}
              </div>
            </ScrollArea>
            <ChatInput onSend={handleSend} disabled={loading} />
          </CardContent>
        </Card>
      )}
    </>
  );
}
