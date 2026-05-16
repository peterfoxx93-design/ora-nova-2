"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "¡Hola! Soy Denti, tu asistente de Ora Nova Dental Clinic. ¿En qué puedo ayudarte hoy? 😊",
  },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(1).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Error en la respuesta");

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "Lo siento, no pude procesar tu mensaje.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Lo siento, tuve un problema para conectarme. Por favor intenta de nuevo más tarde.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent text-dark shadow-glow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Chat con Denti"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] flex flex-col glass-strong overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-glass-border">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-accent" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-surface" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Denti</p>
                <p className="text-text-secondary text-xs">Asistente Virtual</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex gap-2.5 max-w-[85%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      msg.role === "user"
                        ? "bg-accent/20"
                        : "bg-glass"
                    )}
                  >
                    {msg.role === "user" ? (
                      <User className="w-3.5 h-3.5 text-accent" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-accent" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-accent text-dark rounded-tr-md"
                        : "bg-glass text-white rounded-tl-md"
                    )}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5 max-w-[85%]"
                >
                  <div className="w-7 h-7 rounded-full bg-glass flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <div className="px-3.5 py-2.5 rounded-2xl bg-glass rounded-tl-md">
                    <div className="flex gap-1.5">
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-accent"
                      />
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                        className="w-2 h-2 rounded-full bg-accent"
                      />
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                        className="w-2 h-2 rounded-full bg-accent"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-glass-border">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu mensaje..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-glass border border-glass-border text-white placeholder:text-text-secondary/50 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all duration-300 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl bg-accent text-dark flex items-center justify-center hover:shadow-glow transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                  aria-label="Enviar"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
