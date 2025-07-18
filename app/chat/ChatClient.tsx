"use client";

import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: number;
  message: string;
  createdAt: string;
}

export default function ChatClient({ messages }: { messages: ChatMessage[] }) {
  const [chat, setChat] = useState<ChatMessage[]>(messages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
  }, [chat]);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      message: input,
      createdAt: new Date().toISOString(),
    };

    setChat((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: userMessage.message }] }),
      });

      const data = await res.json();

      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        message: data.message || "Gemini didn't respond.",
        createdAt: new Date().toISOString(),
      };

      setChat((prev) => [...prev, botMessage]);
    } catch {
      setChat((prev) => [
        ...prev,
        { id: Date.now() + 2, message: "Error talking to Gemini.", createdAt: new Date().toISOString() },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <div>
      <div ref={containerRef} className="space-y-2 mb-4 h-[500px] overflow-y-auto p-2 border rounded bg-white">
        {chat.map((msg) => (
          <div key={msg.id} className="p-2 bg-gray-100 rounded shadow-sm">
            <div className="text-xs text-gray-500 mb-1">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </div>
            <div>{msg.message}</div>
          </div>
        ))}
        {isLoading && <div className="p-2 italic text-gray-500">Gemini is typing...</div>}
      </div>

      <div className="flex space-x-2 mb-2">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSend}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
