"use client";

import { useCallback, useId, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Sparkles, X } from "lucide-react";

/**
 * Chat launcher.
 *
 * Only this button is in the initial bundle. The panel — with its message
 * state, CSRF exchange and network handling — is imported on first open, so a
 * visitor who never opens the assistant never downloads or parses it. That
 * keeps the widget off the critical path of every page it appears on, which
 * is all of them.
 */
const ChatPanel = dynamic(() => import("./chat-panel").then((m) => m.ChatPanel), {
  ssr: false,
});

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggle = useCallback(() => {
    setLoaded(true);
    setOpen((v) => !v);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const focusTrigger = useCallback(() => triggerRef.current?.focus(), []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        // Warm the chunk on intent rather than on click, so opening feels instant.
        onPointerEnter={() => setLoaded(true)}
        onFocus={() => setLoaded(true)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={
          open
            ? "Close the Code Hippies AI assistant"
            : "Ask Code Hippies' AI assistant — browse 50 common questions"
        }
        data-testid="chat-trigger"
        className="fixed right-4 z-50 grid size-12 place-items-center rounded-full border border-brand-400/30 bg-ink-900/95 text-brand-400 shadow-lg backdrop-blur transition-transform duration-200 hover:scale-105 hover:border-brand-400/60 md:right-6"
        style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))" }}
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Sparkles className="size-5" aria-hidden="true" />}
      </button>

      {loaded ? (
        <ChatPanel
          open={open}
          onClose={close}
          panelId={panelId}
          onRequestFocusTrigger={focusTrigger}
        />
      ) : null}
    </>
  );
}
