/** Shared look of the floating list in Select and Combobox, so every dropdown matches the menus. */
export const popupClass =
  "origin-[var(--transform-origin)] overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none transition duration-100 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0";

export const itemClass =
  "flex min-h-9 w-full cursor-default items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm outline-none select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[selected]:font-medium";
