import { Fragment } from "react";

/**
 * Renders backtick-delimited spans in trusted, build-time copy as <code>.
 * Splits on the delimiter and renders React nodes rather than injecting HTML,
 * so nothing here can produce markup.
 */
export function InlineCode({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
          <code
            key={i}
            className="rounded bg-ink-100/10 px-1 py-0.5 font-mono text-[0.85em] text-ink-100"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
