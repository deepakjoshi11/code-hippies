"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, Loader2, Send } from "lucide-react";
import { site, whatsappHref } from "@/lib/site";

type Message = {
  role: "user" | "assistant";
  text: string;
  sources?: { title: string; page?: string }[];
  refused?: boolean;
};

const SUGGESTIONS = [
  "What does a mobile app cost?",
  "How do you stop an AI from hallucinating?",
  "Which projects used Next.js?",
  "What happens after launch?",
];

const GREETING: Message = {
  role: "assistant",
  text:
    "Ask me anything about the services, the case studies, how projects run or how they're priced. " +
    "I answer only from this site's knowledge base — if I don't have something, I'll say so rather than guess.",
};

export function ChatPanel({
  open,
  onClose,
  panelId,
  onRequestFocusTrigger,
}: {
  open: boolean;
  onClose: () => void;
  panelId: string;
  onRequestFocusTrigger: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csrf, setCsrf] = useState<string | null>(null);

  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || csrf) return;
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((d: { token?: string }) => setCsrf(d.token ?? null))
      .catch(() => setCsrf(null));
  }, [open, csrf]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        onRequestFocusTrigger();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, onRequestFocusTrigger]);

  const send = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || pending) return;

      setError(null);
      setInput("");
      setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
      setPending(true);

      try {
        let token = csrf;
        if (!token) {
          const res = await fetch("/api/csrf");
          token = ((await res.json()) as { token?: string }).token ?? null;
          setCsrf(token);
        }

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(token ? { "x-csrf-token": token } : {}),
          },
          body: JSON.stringify({ question: trimmed }),
        });

        const data = (await response.json()) as {
          answer?: string;
          sources?: { title: string; page?: string }[];
          refused?: boolean;
          error?: string;
        };

        if (!response.ok) {
          setError(data.error ?? "Something went wrong. Try WhatsApp instead.");
          return;
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.answer ?? "",
            sources: data.sources,
            refused: data.refused,
          },
        ]);
      } catch {
        setError("Could not reach the assistant. The WhatsApp button always works.");
      } finally {
        setPending(false);
      }
    },
    [csrf, pending],
  );

  return (
    <div
        id={panelId}
        role="dialog"
        aria-label="Ask Code Hippies' AI assistant"
        aria-modal="false"
        hidden={!open}
        className="fixed right-3 z-50 flex w-[min(23.5rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-ink-100/12 bg-ink-950/97 shadow-[0_24px_70px_rgba(0,0,0,0.6)] backdrop-blur-xl md:right-6"
        style={{
          bottom: "calc(9rem + env(safe-area-inset-bottom, 0px))",
          maxHeight: "min(32rem, calc(100dvh - 12rem))",
        }}
      >
        <header className="flex items-center gap-3 border-b border-ink-100/10 px-4 py-3">
          <span className="grid size-8 place-items-center rounded-lg bg-brand-500/12 text-brand-400">
            <Bot className="size-4" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium text-ink-50">Ask Code Hippies&rsquo; AI</p>
            <p className="text-[0.7rem] text-ink-500">
              Grounded in this site&rsquo;s knowledge base
            </p>
          </div>
        </header>

        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-atomic="false"
          className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "self-end max-w-[85%] rounded-2xl rounded-br-md bg-brand-500/15 px-3.5 py-2.5 text-sm text-ink-50"
                  : "max-w-[92%] rounded-2xl rounded-bl-md bg-ink-100/6 px-3.5 py-2.5 text-sm leading-relaxed text-ink-200"
              }
            >
              <span className="sr-only">{m.role === "user" ? "You asked: " : "Assistant replied: "}</span>
              <p className="whitespace-pre-wrap">{m.text}</p>

              {m.sources && m.sources.length > 0 ? (
                <ul className="mt-2.5 flex flex-wrap gap-1.5 border-t border-ink-100/10 pt-2.5">
                  {m.sources.map((s) =>
                    s.page ? (
                      <li key={s.title}>
                        <Link
                          href={s.page}
                          onClick={onClose}
                          className="rounded-md bg-ink-100/8 px-2 py-1 text-[0.7rem] text-brand-400 hover:bg-ink-100/14"
                        >
                          {s.title}
                        </Link>
                      </li>
                    ) : (
                      <li
                        key={s.title}
                        className="rounded-md bg-ink-100/8 px-2 py-1 text-[0.7rem] text-ink-400"
                      >
                        {s.title}
                      </li>
                    ),
                  )}
                </ul>
              ) : null}

              {m.refused ? (
                <a
                  href={whatsappHref("Hi Deepak — the site assistant did not have an answer for me. Can I ask you directly?")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex rounded-full bg-[#25D366] px-3 py-1.5 text-[0.75rem] font-semibold text-ink-950"
                >
                  {site.whatsappLabel}
                </a>
              ) : null}
            </div>
          ))}

          {pending ? (
            <p className="flex items-center gap-2 text-xs text-ink-500">
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              Searching the knowledge base…
            </p>
          ) : null}

          {messages.length === 1 && !pending ? (
            <ul className="mt-1 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-ink-100/12 px-2.5 py-1.5 text-left text-[0.72rem] text-ink-300 transition-colors hover:border-brand-400/40 hover:text-ink-50"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {error ? (
          <p role="alert" className="border-t border-ink-100/10 px-4 py-2 text-xs text-accent-400">
            {error}
          </p>
        ) : null}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-center gap-2 border-t border-ink-100/10 p-3"
        >
          <label htmlFor={`${panelId}-input`} className="sr-only">
            Your question
          </label>
          <input
            ref={inputRef}
            id={`${panelId}-input`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={500}
            autoComplete="off"
            placeholder="Ask about services, work or pricing…"
            className="min-w-0 flex-1 rounded-full border border-ink-100/12 bg-ink-900/70 px-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-400/50 focus:outline-none"
          />
          <button
            type="submit"
            disabled={pending || input.trim().length < 3}
            aria-label="Send question"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-500 text-ink-950 transition-opacity disabled:opacity-40"
          >
            <Send className="size-4" aria-hidden="true" />
          </button>
        </form>
    </div>
  );
}
