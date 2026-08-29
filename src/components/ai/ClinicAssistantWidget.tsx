"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  cta?: string | null;
};

type ChatResponse = {
  answer: string;
  cta: string | null;
  sessionId: string | null;
  visitorId: string;
};

const starterMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi, I am the MediDove care assistant. I can help with appointments, doctor matching, services, reminders, and reception support.",
    cta: "/appointment",
  },
];

const suggestions = [
  "I need to book an appointment",
  "Find me a dentist",
  "How can reception help me?",
];

const ClinicAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [visitorId] = useState(() => crypto.randomUUID());

  const sendMessage = async (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedMessage,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
          sessionId,
          visitorId,
        }),
      });
      const result = (await response.json()) as ChatResponse | { error: string };

      if (!response.ok || "error" in result) {
        throw new Error("error" in result ? result.error : "Unable to reply.");
      }

      setSessionId(result.sessionId);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.answer,
          cta: result.cta,
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to reply right now.";

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: message,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  return (
    <div className="fixed bottom-5 right-5 z-80">
      <div
        className={cn(
          "mb-4 w-[calc(100vw-40px)] max-w-sm overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl transition",
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-950 p-4 text-white">
          <div>
            <Badge className="mb-2 bg-white/10 text-white">Care Assistant</Badge>
            <h2 className="font-semibold">MediDove Care Assistant</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-md p-2 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Close assistant"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-105 space-y-3 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "rounded-lg p-3 text-sm leading-6",
                message.role === "assistant"
                  ? "bg-slate-100 text-slate-700"
                  : "ml-8 bg-primary text-white",
              )}
            >
              <p>{message.content}</p>
              {message.cta && (
                <Link
                  href={message.cta}
                  className="mt-2 inline-flex font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Open related page
                </Link>
              )}
            </div>
          ))}
          {isSending && (
            <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-3 text-sm text-slate-500">
              <Loader2 className="size-4 animate-spin" />
              Preparing answer...
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => void sendMessage(suggestion)}
                className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:border-primary hover:text-primary"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <form className="flex gap-2" onSubmit={handleSubmit}>
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about booking or services"
              className="h-11"
            />
            <Button type="submit" size="icon" disabled={isSending}>
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>

      <Button
        type="button"
        size="lg"
        onClick={() => setIsOpen((current) => !current)}
        className="h-14 rounded-full px-5 shadow-lg"
      >
        {isOpen ? <X /> : <MessageCircle />}
        {isOpen ? "Close" : "Ask"}
      </Button>
    </div>
  );
};

export default ClinicAssistantWidget;
