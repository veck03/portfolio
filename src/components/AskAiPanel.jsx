import { Fragment, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import useChat from "../hooks/useChat";
import { PROFILE } from "../data/profileData";
import "../styles/AskAiPanel.css";

const EASE = [0.22, 1, 0.36, 1];
const NAME = PROFILE.display_name;

const SUGGESTIONS = [
  `What projects has ${NAME} built?`,
  "What is his tech stack?",
  "Tell me about his education",
  "How can I contact him?",
];

/* ---- tiny safe renderer: **bold**, "- " lists, auto-linked URLs ---- */

function Inline({ text }) {
  const parts = text.split(/(\*\*[^*\n]+\*\*|https?:\/\/[^\s<>()]+)/g);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (/^https?:\/\//.test(part)) {
      const [, url, trail] = part.match(/^(.*?)([.,;:!?]*)$/);
      return (
        <Fragment key={i}>
          <a href={url} target="_blank" rel="noreferrer">{url}</a>
          {trail}
        </Fragment>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function Markdown({ text }) {
  const blocks = [];
  let list = null;
  for (const line of text.replace(/\r/g, "").split("\n")) {
    const item = line.match(/^\s*[-*•]\s+(.*)$/);
    if (item) {
      if (!list) {
        list = { type: "ul", items: [] };
        blocks.push(list);
      }
      list.items.push(item[1]);
    } else {
      list = null;
      if (line.trim()) blocks.push({ type: "p", text: line });
    }
  }
  return blocks.map((b, i) =>
    b.type === "ul" ? (
      <ul key={i}>
        {b.items.map((it, j) => (
          <li key={j}><Inline text={it} /></li>
        ))}
      </ul>
    ) : (
      <p key={i}><Inline text={b.text} /></p>
    )
  );
}

/* ---- panel ---- */

export default function AskAiPanel({ open, onClose }) {
  const reduce = useReducedMotion();
  const { messages, status, send, stop, reset } = useChat();
  const [draft, setDraft] = useState("");
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const stickRef = useRef(true);
  const streaming = status === "streaming";

  // focus the input when the panel opens
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  // Esc closes; Tab stays inside the panel
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll("button:not([disabled]), textarea, a[href]");
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (!panelRef.current.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // on phones the panel is full-screen, so stop the page scrolling behind it
  useEffect(() => {
    if (!open || !window.matchMedia("(max-width: 699px)").matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // follow new text, unless the visitor scrolled up to read
  useEffect(() => {
    const el = bodyRef.current;
    if (el && stickRef.current) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  const onScroll = () => {
    const el = bodyRef.current;
    if (el) stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  // grow the textarea with its content (up to ~5 lines)
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [draft, open]);

  const submit = (text) => {
    const value = (text ?? draft).trim();
    if (!value || streaming) return;
    stickRef.current = true;
    send(value);
    setDraft("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  const slide = reduce ? { opacity: 0 } : { opacity: 0, x: 48, scale: 0.98 };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="scrim"
          className="chat-scrim"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          aria-hidden="true"
        />
      )}
      {open && (
        <motion.aside
          key="panel"
          ref={panelRef}
          className="chat"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-title"
          initial={slide}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={slide}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <header className="chat__head">
            <span className="chat__avatar" aria-hidden="true">{NAME.charAt(0)}.</span>
            <div className="chat__titles">
              <h2 id="chat-title" className="chat__title">{NAME}’s AI Assistant</h2>
              <p className="chat__sub">Projects, skills &amp; education</p>
            </div>
            {messages.length > 0 && (
              <button type="button" className="chat__icon" onClick={reset} aria-label="Start a new chat">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 12a9 9 0 1 0 3-6.7" />
                  <path d="M3 4v5h5" />
                </svg>
              </button>
            )}
            <button type="button" className="chat__icon" onClick={onClose} aria-label="Close assistant">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div className="chat__body" ref={bodyRef} onScroll={onScroll} role="log" aria-live="polite">
            {messages.length === 0 ? (
              <div className="chat__empty">
                <p className="chat__hello">Get to know<br />{NAME}’s work.</p>
                <div className="chat__chips">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} type="button" className="chat__chip" onClick={() => submit(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <ul className="chat__msgs">
                {messages.map((m, i) => {
                  if (m.role === "user") {
                    return <li key={m.id} className="msg msg--user">{m.content}</li>;
                  }
                  const waiting = streaming && i === messages.length - 1 && !m.content;
                  return (
                    <li key={m.id} className={`msg msg--bot${m.error ? " msg--error" : ""}`}>
                      {waiting ? (
                        <span className="dots" aria-label="Thinking"><i /><i /><i /></span>
                      ) : m.error ? (
                        <p>
                          {m.content}{" "}
                          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                        </p>
                      ) : (
                        <Markdown text={m.content} />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <footer className="chat__foot">
            <form
              className="chat__form"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={`Ask about ${NAME}…`}
                aria-label={`Ask about ${NAME}`}
                maxLength={500}
              />
              <button
                type={streaming ? "button" : "submit"}
                className="chat__send"
                onClick={streaming ? stop : undefined}
                disabled={!streaming && !draft.trim()}
                aria-label={streaming ? "Stop generating" : "Send message"}
              >
                {streaming ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                    <rect x="2" y="2" width="10" height="10" rx="2" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" />
                  </svg>
                )}
              </button>
            </form>
            <p className="chat__note">AI can make mistakes. Confirm details with {NAME}.</p>
          </footer>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}