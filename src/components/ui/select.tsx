"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldClass } from "./input";
import { itemClass, popupClass } from "./popup-styles";

export interface Option {
  value: string;
  label: string;
}

interface Props {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  /** Shown when `value` matches no option, for example "Choose a doctor". */
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  "aria-label"?: string;
}

/**
 * The themed select for a short, fixed set of choices (roughly a dozen or fewer). For a long or growing list
 * where the user needs to type to find an item, use `Combobox` instead.
 */
export function Select({
  id,
  value,
  onValueChange,
  options,
  placeholder = "Select",
  disabled,
  invalid,
  className,
  "aria-label": ariaLabel,
}: Props) {
  return (
    <SelectPrimitive.Root
      items={options}
      value={value}
      onValueChange={(next) => onValueChange((next as string | null) ?? "")}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        id={id}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        className={cn(
          fieldClass,
          "flex items-center justify-between gap-2 text-left whitespace-nowrap data-[popup-open]:border-ring data-[popup-open]:ring-3 data-[popup-open]:ring-ring/30",
          className,
        )}
      >
        <SelectPrimitive.Value
          placeholder={placeholder}
          className="truncate data-[placeholder]:text-muted-foreground"
        />
        <SelectPrimitive.Icon className="shrink-0 text-muted-foreground">
          <ChevronDown className="size-4" aria-hidden="true" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          sideOffset={6}
          alignItemWithTrigger={false}
          className="z-[70] outline-none"
        >
          <SelectPrimitive.Popup className={cn(popupClass, "min-w-[var(--anchor-width)]")}>
            <SelectPrimitive.List className="max-h-[min(20rem,var(--available-height))] overflow-y-auto overscroll-contain outline-none">
              {options.map((option) => (
                <SelectPrimitive.Item key={option.value} value={option.value} className={itemClass}>
                  <SelectPrimitive.ItemText className="min-w-0 flex-1 truncate">
                    {option.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <Check className="size-4 text-primary" aria-hidden="true" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
