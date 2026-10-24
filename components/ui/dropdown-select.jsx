"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Radix items can't use "" as a value, so "All …" style options are mapped through a sentinel
const EMPTY = "__empty__";
const toRadix = (v) => (v === "" || v === null || v === undefined ? EMPTY : String(v));
const fromRadix = (v) => (v === EMPTY ? "" : v);

const sizes = {
  sm: "h-9 rounded-lg px-3 text-[13px]",
  md: "h-10 rounded-xl px-3.5 text-sm",
  lg: "h-11 rounded-xl px-4 text-sm",
};

const variants = {
  default:
    "border border-gray-200 bg-surface text-gray-900 shadow-sm shadow-gray-900/[0.02] hover:border-gray-300 data-[state=open]:border-gray-400 data-[state=open]:ring-4 data-[state=open]:ring-gray-900/5",
  ghost: "border-0 bg-transparent text-gray-600 hover:text-gray-900",
};

/**
 * Styled single-select dropdown.
 * options: [{ value, label, icon?: LucideIcon, description? }]
 */
export function DropdownSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select…",
  id,
  label,
  size = "md",
  variant = "default",
  icon: LeadingIcon,
  className,
  contentClassName,
  disabled,
  align = "start",
}) {
  const selected = options.find((o) => toRadix(o.value) === toRadix(value));

  return (
    // "" tells Radix nothing is selected, so the placeholder shows
    <SelectPrimitive.Root value={selected ? toRadix(value) : ""} onValueChange={(v) => onChange?.(fromRadix(v))} disabled={disabled}>
      <SelectPrimitive.Trigger
        id={id}
        aria-label={label}
        className={cn(
          "group inline-flex w-full min-w-0 items-center gap-2 text-left font-medium outline-none transition disabled:pointer-events-none disabled:opacity-50",
          sizes[size],
          variants[variant],
          className
        )}
      >
        {LeadingIcon && <LeadingIcon className="h-4 w-4 shrink-0 text-gray-400" />}
        {selected?.icon && !LeadingIcon && <selected.icon className="h-4 w-4 shrink-0 text-gray-500" />}
        <span className={cn("min-w-0 flex-1 truncate", !selected && "text-gray-400")}>
          {/* always pass children so Radix never also portals the item text in (React warns when both happen) */}
          <SelectPrimitive.Value placeholder={placeholder}>{selected?.label ?? ""}</SelectPrimitive.Value>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          align={align}
          className={cn(
            "relative z-[100] max-h-[min(20rem,var(--radix-select-content-available-height))] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-gray-200/80 bg-surface text-gray-900 shadow-xl shadow-gray-900/10",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
            contentClassName
          )}
        >
          <SelectPrimitive.ScrollUpButton className="flex h-6 items-center justify-center text-gray-400">
            <ChevronUp className="h-4 w-4" />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="p-1.5">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={toRadix(option.value)}
                value={toRadix(option.value)}
                disabled={option.disabled}
                className="relative flex cursor-pointer select-none items-center gap-2.5 rounded-xl py-2 pl-3 pr-9 text-sm text-gray-700 outline-none transition-colors data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900 data-[state=checked]:font-semibold data-[state=checked]:text-gray-900 data-[disabled]:opacity-40"
              >
                {option.icon && <option.icon className="h-4 w-4 shrink-0 text-gray-400" />}
                <span className="min-w-0">
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  {option.description && <span className="block text-xs font-normal text-gray-500">{option.description}</span>}
                </span>
                <SelectPrimitive.ItemIndicator className="absolute right-3 flex items-center">
                  <Check className="h-4 w-4 text-brand" strokeWidth={2.5} />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="flex h-6 items-center justify-center text-gray-400">
            <ChevronDown className="h-4 w-4" />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

export default DropdownSelect;
