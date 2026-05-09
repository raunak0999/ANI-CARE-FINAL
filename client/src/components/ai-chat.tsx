// client/src/components/AiChat.tsx
import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ChatMessageType } from "@/lib/types";

const SUGGESTED_QUESTIONS = [
  "🐕 What food is best for my pet?",
  "💊 How often should I visit the vet?",
  "🎾 Best exercises for my dog's breed?",
  "✂️ How often should I groom my pet?",
];

export default function AiChat() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "greeting",
      text: "Hello! 🐾 I'm your AniCare AI assistant. Ask me anything about pet care — nutrition, grooming, training, health tips, and more! I'm here to help your furry friend thrive.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: petData } = useQuery({
    queryKey: ["pet-profile"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/pet-profiles");
      if (!res.ok) throw new Error("No pet profile found");
      return res.json();
    },
    retry: false,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          sessionId,
          petContext: petData ? JSON.stringify(petData.profile) : undefined,
        }),
      });
      if (!res.ok) throw new Error("Chat request failed");
      const json = await res.json();
      return json;
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const userMsg: ChatMessageType = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    sendMessageMutation.mutate(inputMessage);
    setInputMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    const userMsg: ChatMessageType = {
      id: Date.now().toString(),
      text: question,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    sendMessageMutation.mutate(question);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const showSuggestions = messages.length <= 1;

  return (
    <section id="chatbot" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI Pet Care Assistant
          </h2>
          <p className="text-xl text-gray-600">
            Get instant answers to all your pet care questions
          </p>
          {petData?.profile?.name && (
            <Badge className="mt-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white text-sm px-4 py-1.5">
              🐾 Personalised for {petData.profile.name}
            </Badge>
          )}
        </div>

        <Card className="shadow-xl border-0 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">AniCare AI</h3>
              <p className="text-orange-100 text-xs">
                Always here to help • Powered by AI
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/80 text-xs">Online</span>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="chat-container p-4 bg-gray-50"
            style={{ height: 420, overflowY: "auto" }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 mb-4 ${
                  msg.isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.isUser
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {msg.isUser ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    msg.isUser
                      ? "bg-orange-500 text-white rounded-tr-sm"
                      : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>
                  <p
                    className={`text-[10px] mt-1 ${
                      msg.isUser ? "text-orange-200" : "text-gray-400"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {sendMessageMutation.isPending && (
              <div className="flex gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {showSuggestions && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2 font-medium">
                Suggested questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedQuestion(q)}
                    className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about pet care..."
                className="flex-1 rounded-full border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                disabled={sendMessageMutation.isPending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={
                  !inputMessage.trim() || sendMessageMutation.isPending
                }
                className="bg-primary text-white hover:bg-orange-600 rounded-full w-10 h-10 p-0 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
