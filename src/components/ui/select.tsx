import { Select as BaseSelect } from '@base-ui/react/select'
import { Check, ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

export const Select = BaseSelect.Root

export function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Trigger>) {
  return (
    <BaseSelect.Trigger
      className={cn(
        'flex h-11 min-w-40 items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none select-none data-popup-open:ring-2 data-popup-open:ring-ring/30 focus-visible:ring-2 focus-visible:ring-ring/30',
        className,
      )}
      {...props}
    >
      {children}
      <BaseSelect.Icon>
        <ChevronsUpDown className="size-4 opacity-50" />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  )
}

export const SelectValue = BaseSelect.Value

export function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Popup>) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner className="z-50 outline-none select-none" sideOffset={4}>
        <BaseSelect.Popup
          className={cn(
            'min-w-[var(--anchor-width)] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md outline-none',
            'origin-[var(--transform-origin)] transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
            className,
          )}
          {...props}
        >
          <BaseSelect.ScrollUpArrow className="flex h-4 w-full items-center justify-center">
            <ChevronUp className="size-3" />
          </BaseSelect.ScrollUpArrow>
          <BaseSelect.List className="max-h-[min(24rem,var(--available-height))] overflow-y-auto p-1">
            {children}
          </BaseSelect.List>
          <BaseSelect.ScrollDownArrow className="flex h-4 w-full items-center justify-center">
            <ChevronDown className="size-3" />
          </BaseSelect.ScrollDownArrow>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  )
}

export function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Item>) {
  return (
    <BaseSelect.Item
      className={cn(
        'grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm px-2 py-2.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground',
        className,
      )}
      {...props}
    >
      <BaseSelect.ItemIndicator className="col-start-1">
        <Check className="size-3.5" />
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText className="col-start-2">{children}</BaseSelect.ItemText>
    </BaseSelect.Item>
  )
}
