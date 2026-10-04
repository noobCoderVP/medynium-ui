"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldClass } from "./input";
import { itemClass, popupClass } from "./popup-styles";
import type { Option } from "./select";

interface Props {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  /** Shown in the list when typing matches nothing. */
  emptyText?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  "aria-label"?: string;
}

/**
 * A typable, filtering select for a long or growing list (drugs, people). Type to narrow, arrows to move, Enter to
 * choose, and the clear button resets it. Use `Select` for a short fixed set.
 */
export function Combobox({
  id,
  value,
  onValueChange,
  options,
  placeholder = "Type to search",
  emptyText = "No matches.",
  disabled,
  invalid,
  className,
  "aria-label": ariaLabel,
}: Props) {
  const selected = options.find((option) => option.value === value) ?? null;
  return (
    <ComboboxPrimitive.Root
      items={options}
      value={selected}
      onValueChange={(next) => onValueChange((next as Option | null)?.value ?? "")}
      disabled={disabled}
    >
      <ComboboxPrimitive.InputGroup className={cn("relative", className)}>
        <ComboboxPrimitive.Input
          id={id}
          aria-label={ariaLabel}
          aria-invalid={invalid || undefined}
          placeholder={placeholder}
          className={cn(fieldClass, "pr-16")}
        />
        <div className="absolute inset-y-0 right-1 flex items-center">
          {selected ? (
            <ComboboxPrimitive.Clear
              aria-label="Clear selection"
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" aria-hidden="true" />
            </ComboboxPrimitive.Clear>
          ) : null}
          <ComboboxPrimitive.Trigger
            aria-label="Show options"
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ChevronDown className="size-4" aria-hidden="true" />
          </ComboboxPrimitive.Trigger>
        </div>
      </ComboboxPrimitive.InputGroup>
      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner sideOffset={6} className="z-[70] outline-none">
          <ComboboxPrimitive.Popup
            className={cn(
              popupClass,
              "w-[var(--anchor-width)] max-w-[var(--available-width)] min-w-48",
            )}
          >
            <ComboboxPrimitive.Empty className="px-2.5 py-3 text-sm text-muted-foreground empty:hidden">
              {emptyText}
            </ComboboxPrimitive.Empty>
            <ComboboxPrimitive.List className="max-h-[min(20rem,var(--available-height))] overflow-y-auto overscroll-contain outline-none">
              {(option: Option) => (
                <ComboboxPrimitive.Item key={option.value} value={option} className={itemClass}>
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  <ComboboxPrimitive.ItemIndicator>
                    <Check className="size-4 text-primary" aria-hidden="true" />
                  </ComboboxPrimitive.ItemIndicator>
                </ComboboxPrimitive.Item>
              )}
            </ComboboxPrimitive.List>
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </ComboboxPrimitive.Root>
  );
}
