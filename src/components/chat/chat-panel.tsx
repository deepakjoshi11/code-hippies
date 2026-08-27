"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bot, ChevronLeft, Loader2, MessageSquareText, Search, Send } from "lucide-react";
import { primaryChannel } from "@/data/channels";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  text: string;
  sources?: { title: string; page?: string }[];
  refused?: boolean;
  faq?: { question: string; category: string };
  related?: string[];
};

type FaqIndex = { total: number; categories: { category: string; questions: string[] }[] };

const GREETING: Message = {
  role: "assistant",
  text:
    "Ask me anything about the services, the case studies, how projects run or how they're priced. " +
    "There are 50 common questions you can browse below — or type your own. " +
    "I answer only from this site's knowledge base, so if I don't have something I'll say so rather than guess.",
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
  const [tab, setTab] = useState<"chat" | "browse">("browse");
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csrf, setCsrf] = useState<string | null>(null);
  const [faqIndex, setFaqIndex] = useState<FaqIndex | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    if (!csrf) {
      fetch("/api/csrf")
        .then((r) => r.json())
        .then((d: { token?: string }) => setCsrf(d.token ?? null))
        .catch(() => setCsrf(null));
    }
    if (!faqIndex) {
      fetch("/api/faq")
        .then((r) => r.json())
        .then((d: FaqIndex) => setFaqIndex(d))
        .catch(() => setFaqIndex(null));
    }
  }, [open, csrf, faqIndex]);

  useEffect(() => {
    if (!open) return;
    if (tab === "chat") inputRef.current?.focus();
    else searchRef.current?.focus();
  }, [open, tab]);

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

      setTab("chat");
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
          headers: { "content-type": "application/json", ...(token ? { "x-csrf-token": token } : {}) },
          body: JSON.stringify({ question: trimmed }),
        });

        const data = (await response.json()) as Message & { answer?: string; error?: string };

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
            faq: data.faq,
            related: data.related,
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

  const searchResults = useMemo(() => {
    if (!faqIndex || filter.trim().length < 2) return null;
    const needle = filter.toLowerCase().trim();
    return faqIndex.categories
      .flatMap((c) => c.questions.map((q) => ({ q, category: c.category })))
      .filter((item) => item.q.toLowerCase().includes(needle))
      .slice(0, 12);
  }, [faqIndex, filter]);

  const activeCategory = faqIndex?.categories.find((c) => c.category === openCategory);

  return (
    <div
      id={panelId}
      role="dialog"
      aria-label="Ask Code Hippies' AI assistant"
      aria-modal="false"
      hidden={!open}
      className="fixed right-3 z-50 flex w-[min(23.5rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-ink-100/12 bg-ink-950/97 shadow-[0_24px_70px_rgba(0,0,0,0.6)] backdrop-blur-xl md:right-6"
      style={{
        bottom: "calc(9.5rem + env(safe-area-inset-bottom, 0px))",
        maxHeight: "min(34rem, calc(100dvh - 13rem))",
      }}
    >
      <header className="flex items-center gap-3 border-b border-ink-100/10 px-4 py-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-500/12 text-brand-400">
          <Bot className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink-50">Ask Code Hippies&rsquo; AI</p>
          <p className="truncate text-[0.7rem] text-ink-500">
            {faqIndex ? `${faqIndex.total} common questions` : "Grounded in this site's knowledge base"}
          </p>
        </div>
      </header>

      <div role="tablist" aria-label="Assistant mode" className="flex gap-1 border-b border-ink-100/10 px-2 py-2">
        {(["browse", "chat"] as const).map((value) => (
          <button
            key={value}
            role="tab"
            type="button"
            id={`${panelId}-tab-${value}`}
            aria-selected={tab === value}
            aria-controls={`${panelId}-pane-${value}`}
            onClick={() => setTab(value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
              tab === value
                ? "bg-brand-500/12 text-brand-400"
                : "text-ink-400 hover:bg-ink-100/6 hover:text-ink-100",
            )}
          >
            {value === "browse" ? (
              <>
                <MessageSquareText className="size-3.5" aria-hidden="true" /> Browse questions
              </>
            ) : (
              <>
                <Bot className="size-3.5" aria-hidden="true" /> Conversation
              </>
            )}
          </button>
        ))}
      </div>

      {/* ---------------------------------------------------------- browse -- */}
      <div
        id={`${panelId}-pane-browse`}
        role="tabpanel"
        aria-labelledby={`${panelId}-tab-browse`}
        hidden={tab !== "browse"}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="border-b border-ink-100/10 p-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-500"
              aria-hidden="true"
            />
            <label htmlFor={`${panelId}-search`} className="sr-only">
              Search the common questions
            </label>
            <input
              ref={searchRef}
              id={`${panelId}-search`}
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search questions…"
              className="w-full rounded-full border border-ink-100/12 bg-ink-900/70 py-2.5 pl-9 pr-3 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-400/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {!faqIndex ? (
            <p className="px-1 py-2 text-xs text-ink-500">Loading questions…</p>
          ) : searchResults ? (
            searchResults.length > 0 ? (
              <ul className="flex flex-col gap-1.5">
                {searchResults.map((item) => (
                  <li key={item.q}>
                    <QuestionButton
                      label={item.q}
                      hint={item.category}
                      onSelect={() => void send(item.q)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-1 py-3">
                <p className="text-xs leading-relaxed text-ink-400">
                  Nothing matches &ldquo;{filter}&rdquo;. Ask it in your own words in the
                  Conversation tab — or message on WhatsApp for a direct answer.
                </p>
                <button
                  type="button"
                  onClick={() => void send(filter)}
                  className="mt-3 rounded-full bg-brand-500 px-3.5 py-2 text-xs font-semibold text-ink-950"
                >
                  Ask it anyway
                </button>
              </div>
            )
          ) : activeCategory ? (
            <>
              <button
                type="button"
                onClick={() => setOpenCategory(null)}
                className="mb-2 flex items-center gap-1 rounded-md px-1 py-1.5 text-xs text-ink-400 hover:text-ink-100"
              >
                <ChevronLeft className="size-3.5" aria-hidden="true" /> All categories
              </button>
              <p className="px-1 pb-2 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-ink-500">
                {activeCategory.category}
              </p>
              <ul className="flex flex-col gap-1.5">
                {activeCategory.questions.map((q) => (
                  <li key={q}>
                    <QuestionButton label={q} onSelect={() => void send(q)} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {faqIndex.categories.map((c) => (
                <li key={c.category}>
                  <button
                    type="button"
                    onClick={() => setOpenCategory(c.category)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-ink-100/10 px-3.5 py-3 text-left text-sm text-ink-100 transition-colors hover:border-brand-400/35 hover:bg-ink-100/5"
                  >
                    <span>{c.category}</span>
                    <span className="shrink-0 rounded-full bg-ink-100/8 px-2 py-0.5 font-mono text-[0.7rem] text-ink-400">
                      {c.questions.length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------ chat -- */}
      <div
        id={`${panelId}-pane-chat`}
        role="tabpanel"
        aria-labelledby={`${panelId}-tab-chat`}
        hidden={tab !== "chat"}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-atomic="false"
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "max-w-[85%] self-end rounded-2xl rounded-br-md bg-brand-500/15 px-3.5 py-2.5 text-sm text-ink-50"
                  : "max-w-[92%] rounded-2xl rounded-bl-md bg-ink-100/6 px-3.5 py-2.5 text-sm leading-relaxed text-ink-200"
              }
            >
              <span className="sr-only">{m.role === "user" ? "You asked: " : "Assistant replied: "}</span>
              {m.faq ? (
                <p className="mb-1.5 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-brand-400">
                  {m.faq.category}
                </p>
              ) : null}
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
                      <li key={s.title} className="rounded-md bg-ink-100/8 px-2 py-1 text-[0.7rem] text-ink-400">
                        {s.title}
                      </li>
                    ),
                  )}
                </ul>
              ) : null}

              {m.related && m.related.length > 0 ? (
                <div className="mt-2.5 border-t border-ink-100/10 pt-2.5">
                  <p className="mb-1.5 text-[0.7rem] text-ink-500">
                    {m.refused ? "Did you mean one of these?" : "People also ask"}
                  </p>
                  <ul className="flex flex-col gap-1">
                    {m.related.map((q) => (
                      <li key={q}>
                        <button
                          type="button"
                          onClick={() => void send(q)}
                          className="w-full rounded-lg px-2 py-1.5 text-left text-[0.75rem] text-brand-400 transition-colors hover:bg-ink-100/8"
                        >
                          {q}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {m.refused ? (
                <RefusalFallback />
              ) : null}
            </div>
          ))}

          {pending ? (
            <p className="flex items-center gap-2 text-xs text-ink-500">
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              Checking the knowledge base…
            </p>
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
    </div>
  );
}

/**
 * Escape hatch shown when the assistant refuses. Uses whichever direct channel
 * is configured and falls back to the brief form, so a refusal always ends in
 * a way to reach a human.
 */
function RefusalFallback() {
  const channel = primaryChannel(
    "Hi Deepak — the site assistant did not have an answer for me. Can I ask you directly?",
  );
  if (!channel) {
    return (
      <Link
        href="/contact"
        className="mt-2.5 inline-flex rounded-full bg-brand-500 px-3 py-1.5 text-[0.75rem] font-semibold text-ink-950"
      >
        Send a project brief
      </Link>
    );
  }
  return (
    <a
      href={channel.href!}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2.5 inline-flex rounded-full px-3 py-1.5 text-[0.75rem] font-semibold text-ink-950"
      style={{ backgroundColor: channel.color }}
    >
      Ask on {channel.label}
    </a>
  );
}

function QuestionButton({
  label,
  hint,
  onSelect,
}: {
  label: string;
  hint?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full rounded-xl border border-ink-100/10 px-3.5 py-2.5 text-left transition-colors hover:border-brand-400/35 hover:bg-ink-100/5"
    >
      <span className="block text-[0.82rem] leading-snug text-ink-100">{label}</span>
      {hint ? (
        <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.1em] text-ink-500">{hint}</span>
      ) : null}
    </button>
  );
}
