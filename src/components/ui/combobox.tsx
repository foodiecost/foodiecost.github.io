import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ComboboxOption {
  value: string
  label: string
}

interface IngredientComboboxProps {
  options: ComboboxOption[]
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  emptyMessage?: string
  disabled?: boolean
}

export function SearchCombobox({
  options,
  value,
  onChange,
  placeholder = 'Търсене...',
  emptyMessage = 'Няма намерени резултати.',
  disabled,
}: IngredientComboboxProps) {
  const items = React.useMemo(
    () =>
      BaseCombobox.createItems(options, {
        getValue: (option) => option.value,
        getLabel: (option) => option.label,
      }),
    [options],
  )

  return (
    <BaseCombobox.Root
      items={items}
      value={value}
      onValueChange={(next) => onChange((next as string | null) ?? null)}
      disabled={disabled}
    >
      <BaseCombobox.InputGroup className="relative flex h-9 w-full items-center rounded-md border border-input bg-transparent shadow-xs focus-within:ring-2 focus-within:ring-ring/30">
        <BaseCombobox.Input
          placeholder={placeholder}
          className="h-full w-full rounded-md bg-transparent px-3 pr-8 text-sm outline-none placeholder:text-muted-foreground"
        />
        <BaseCombobox.Trigger
          className="absolute right-0 flex h-full w-8 items-center justify-center text-muted-foreground"
          aria-label="Отвори списъка"
        >
          <ChevronsUpDown className="size-4" />
        </BaseCombobox.Trigger>
      </BaseCombobox.InputGroup>

      <BaseCombobox.Portal>
        <BaseCombobox.Positioner className="z-50 outline-none" sideOffset={4}>
          <BaseCombobox.Popup className="w-[var(--anchor-width)] max-w-[var(--available-width)] origin-[var(--transform-origin)] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <BaseCombobox.Empty className="px-3 py-3 text-sm text-muted-foreground">
              {emptyMessage}
            </BaseCombobox.Empty>
            <BaseCombobox.List className="max-h-64 overflow-y-auto p-1">
              {(option: ComboboxOption) => (
                <BaseCombobox.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    'grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground',
                  )}
                >
                  <BaseCombobox.ItemIndicator className="col-start-1">
                    <Check className="size-3.5" />
                  </BaseCombobox.ItemIndicator>
                  <span className="col-start-2 truncate">{option.label}</span>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  )
}
