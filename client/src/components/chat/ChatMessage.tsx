import { cn } from "@/lib/utils";

export type ChatMessageRole = "user" | "assistant";

export interface ChatMessageData {
  role: ChatMessageRole;
  content: string;
  action?: { type: "navigate"; page: string };
}

interface ChatMessageProps {
  message: ChatMessageData;
  onNavigate?: (page: string) => void;
  className?: string;
}

export function ChatMessage({ message, onNavigate, className }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-2",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground border border-border"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        {message.action?.type === "navigate" && onNavigate && (
          <button
            type="button"
            className="mt-2 text-xs underline opacity-90 hover:opacity-100"
            onClick={() => onNavigate(message.action!.page)}
          >
            Go to {message.action.page}
          </button>
        )}
      </div>
    </div>
  );
}
