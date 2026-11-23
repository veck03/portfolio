import { useCallback, useEffect, useRef, useState } from "react";

const CHAT_URL = import.meta.env.VITE_CHAT_URL;
const STORAGE_KEY = "portfolio-chat-v1";
const MAX_CHARS = 500;
const HISTORY_LIMIT = 10;

const TEXT = {
  rate_limited: "You’re sending messages a little fast. Please wait a moment and try again.",
  unavailable: "The assistant isn’t available right now. You can email me instead.",
  not_configured: "The assistant isn’t set up yet. You can email me instead.",
  empty: "I couldn’t come up with an answer to that. Try rephrasing, or email me.",
  interrupted: "The reply was cut off. Please try again.",
  default: "Something went wrong. Please try again, or email me.",
};

const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function loadSaved() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved)
      ? saved.filter(
          (m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
        )
      : [];
  } catch {
    return [];
  }
}

export default function useChat() {
  const [messages, setMessages] = useState(loadSaved);
  const [status, setStatus] = useState("idle"); // "idle" | "streaming"
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const abortRef = useRef(null);

  // Keep the conversation for this tab (not while a reply is streaming in).
  useEffect(() => {
    if (status === "streaming") return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* storage unavailable */
    }
  }, [messages, status]);

  const patch = useCallback(
    (id, changes) =>
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...changes } : m))),
    []
  );

  const send = useCallback(
    async (raw) => {
      const text = String(raw || "").trim().slice(0, MAX_CHARS);
      if (!text || abortRef.current) return;

      const userMsg = { id: uid(), role: "user", content: text };
      const botMsg = { id: uid(), role: "assistant", content: "" };

      // What the model sees: the recent turns, minus failed replies.
      const history = [...messagesRef.current, userMsg]
        .filter((m) => !m.error && m.content)
        .slice(-HISTORY_LIMIT)
        .map(({ role, content }) => ({ role, content }));

      setMessages((prev) => [...prev, userMsg, botMsg]);

      if (!CHAT_URL) {
        patch(botMsg.id, { content: TEXT.not_configured, error: true });
        return;
      }

      const controller = new AbortController();
      abortRef.current = controller;
      setStatus("streaming");
      let answer = "";

      try {
        const res = await fetch(CHAT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          const err = new Error("http");
          err.code = data.error;
          throw err;
        }
        if (!res.body) throw new Error("no body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          answer += decoder.decode(value, { stream: true });
          patch(botMsg.id, { content: answer });
        }
        answer += decoder.decode();

        if (answer.trim()) patch(botMsg.id, { content: answer });
        else patch(botMsg.id, { content: TEXT.empty, error: true });
      } catch (err) {
        if (err.name === "AbortError") {
          // stopped by the user: keep whatever arrived, drop an empty bubble
          setMessages((prev) => prev.filter((m) => m.id !== botMsg.id || m.content));
        } else {
          console.error("Chat request failed:", err);
          patch(botMsg.id, {
            content: answer.trim()
              ? `${answer}\n\n${TEXT.interrupted}`
              : TEXT[err.code] || TEXT.default,
            error: true,
          });
        }
      } finally {
        abortRef.current = null;
        setStatus("idle");
      }
    },
    [patch]
  );

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { messages, status, send, stop, reset };
}
