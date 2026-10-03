"use client";

import type { KeyboardEvent, PointerEvent } from "react";
import { MAX_WIDTH, MIN_WIDTH } from "../hooks/use-panel-width";

const STEP = 16;

/**
 * The drag edge on the assistant's left side. A pointer drag resizes it; with the keyboard, focus it and use the
 * arrow keys (Home and End jump to the limits). Hidden on phones, where the panel is a bottom sheet.
 */
export function ResizeHandle({
  width,
  onResize,
}: {
  width: number;
  onResize: (width: number, persist?: boolean) => void;
}) {
  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = width;
    // The panel is anchored right, so dragging left makes it wider.
    const move = (e: globalThis.PointerEvent) => onResize(startWidth + (startX - e.clientX), false);
    const end = (e: globalThis.PointerEvent) => {
      onResize(startWidth + (startX - e.clientX));
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = {
      ArrowLeft: width + STEP,
      ArrowRight: width - STEP,
      Home: MIN_WIDTH,
      End: MAX_WIDTH,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    onResize(next);
  }

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize assistant"
      aria-valuemin={MIN_WIDTH}
      aria-valuemax={MAX_WIDTH}
      aria-valuenow={width}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className="absolute inset-y-0 left-0 z-10 hidden w-1.5 -translate-x-1/2 cursor-col-resize touch-none transition-colors outline-none hover:bg-primary/40 focus-visible:bg-primary md:block"
    />
  );
}
