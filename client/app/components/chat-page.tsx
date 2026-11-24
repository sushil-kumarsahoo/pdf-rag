"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Doc {
  pageContent?: string;
  metadata?: {
    loc?: {
      pageNumber?: number;
    };
    source?: string;
  };
}

interface IMessage {
  role: "assistant" | "user";
  content?: string;
  documents?: Doc[];
}

const ChatComponent: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = message.trim();
    if (!query || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/chat?message=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          documents: data.docs,
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Failed to connect to server.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-purple-600 text-white"
                  : "bg-muted text-foreground border border-border"
              }`}
            >
              {msg.content}
            </div>

            {msg.documents && msg.documents.length > 0 && (
              <div className="text-xs text-muted-foreground mt-1 flex gap-2">
                <span>Sources:</span>
                {msg.documents.map((doc, dIdx) => (
                  <span
                    key={dIdx}
                    className="bg-accent px-1.5 py-0.5 rounded text-[11px]"
                  >
                    Page {doc.metadata?.loc?.pageNumber ?? dIdx + 1}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="text-xs text-muted-foreground italic">Thinking...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Styled Input & Button at bottom */}
      <div className="p-4 border-t bg-background shrink-0">
        <form onSubmit={handleSendChatMessage} className="flex gap-2 w-full max-w-4xl mx-auto">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Ask a question..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            variant="outline"
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
