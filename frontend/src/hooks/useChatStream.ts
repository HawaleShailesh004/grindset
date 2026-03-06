import { useState, useEffect } from "react";
import type { ChatMessage } from "../types";
import { STORAGE_KEYS } from "../constants";
import { getChatUrl, getAuthHeaders } from "../utils/api";

function getChatStorageKey(slug: string): string {
  return `${STORAGE_KEYS.CHAT_PREFIX}${slug}`;
}

export function useChatStream(
  problemData: { title?: string; difficulty?: string; content?: string; question?: string } | null,
  userKey: string,
  slug: string | null,
  token: string | null = null
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const key = getChatStorageKey(slug);
    chrome.storage.local.get([key], (result) => {
      const stored = result[key] as ChatMessage[] | undefined;
      if (stored?.length) setMessages(stored);
    });
  }, [slug]);

  useEffect(() => {
    if (!slug || messages.length === 0) return;
    const validHistory = messages.filter((msg) => !msg.isError);
    chrome.storage.local.set({ [getChatStorageKey(slug)]: validHistory });
  }, [messages, slug]);

  const sendMessage = async (input: string) => {
    if (!input.trim() || !problemData) return;

    const newHistory: ChatMessage[] = [...messages, { role: "user", content: input }];
    setMessages(newHistory);
    setLoading(true);

    try {
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(getChatUrl(), {
        method: "POST",
        headers: token ? getAuthHeaders(token) : { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory,
          problemContext: {
            title: problemData.title,
            difficulty: problemData.difficulty,
            description: problemData.content ?? problemData.question,
          },
          userApiKey: userKey,
        }),
      });

      // Handle 429 Quota Error
      if (res.status === 429) {
        const data = await res.json();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: data.error || "Daily limit reached.",
            isError: true, // This flag now prevents saving
          };
          return updated;
        });
        return;
      }

      if (!res.ok) throw new Error("Server Error");
      if (!res.body) throw new Error("No Stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        aiResponse += text;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: aiResponse,
          };
          return updated;
        });
      }
    } catch (err) {
      // Fix: Replace the placeholder with error (don't append new)
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "❌ Connection Error. Is the backend running?",
          isError: true,
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, sendMessage, setMessages };
};
