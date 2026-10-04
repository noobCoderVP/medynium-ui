"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "running" | "done";

/**
 * A thin bar under the top edge while a page change is in flight. It starts on a click of an in-app link to a
 * different path and finishes when the pathname changes (or after a safety timeout, so it can never stick).
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const current = useRef(pathname);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === current.current) return;
      clear();
      setPhase("running");
      timers.current.push(window.setTimeout(() => setPhase("idle"), 10_000));
    }
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      clear();
    };
  }, []);

  useEffect(() => {
    if (current.current === pathname) return;
    current.current = pathname;
    clear();
    setPhase("done");
    timers.current.push(window.setTimeout(() => setPhase("idle"), 300));
  }, [pathname]);

  if (phase === "idle") return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden"
    >
      <div
        className={
          phase === "running"
            ? "h-full w-full origin-left animate-[route-progress_10s_cubic-bezier(0.1,0.7,0.2,1)_forwards] bg-primary motion-reduce:animate-none"
            : "h-full w-full bg-primary transition-opacity duration-300"
        }
        style={phase === "done" ? { opacity: 0 } : undefined}
      />
    </div>
  );
}
