import type { ReactNode } from "react";

/**
 * A small, safe markdown renderer for the written patient summary: `##` headings, `-` bullets, `**bold**`, `*italic*`
 * and paragraphs. It builds React elements only (never HTML strings), so nothing in the text can inject markup, and
 * anything else is shown as plain text.
 */
function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      match[1] !== undefined ? (
        <strong key={match.index} className="font-semibold text-heading">
          {match[1]}
        </strong>
      ) : (
        <em key={match.index}>{match[2]}</em>
      ),
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function Markdown({ text, className }: { text: string; className?: string }) {
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (bullets.length === 0) return;
    const items = bullets;
    bullets = [];
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="list-disc space-y-1 pl-5">
        {items.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </ul>,
    );
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const heading = /^#{1,4}\s+(.*)$/.exec(line);
    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (bullet) {
      bullets.push(bullet[1]);
      continue;
    }
    flush();
    if (heading) {
      blocks.push(
        <h3
          key={`h-${blocks.length}`}
          className="mt-3 border-b border-border pb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase first:mt-0"
        >
          {heading[1]}
        </h3>,
      );
    } else if (line) {
      blocks.push(<p key={`p-${blocks.length}`}>{inline(line)}</p>);
    }
  }
  flush();
  return <div className={`space-y-2 text-sm leading-relaxed ${className ?? ""}`}>{blocks}</div>;
}
