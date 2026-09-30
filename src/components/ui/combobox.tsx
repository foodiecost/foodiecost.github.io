import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ComboboxOption {
  value: string
  label: string
}

const CREATE_OPTION_VALUE = '__foodiecost_create_new__'

interface IngredientComboboxProps {
  options: ComboboxOption[]
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  emptyMessage?: string
  disabled?: boolean
  /** When provided, typing a name with no exact match shows a "Създай ..." option. */
  onCreateNew?: (query: string) => void
}

export function SearchCombobox({
  options,
  value,
  onChange,
  placeholder = 'Търсене...',
  emptyMessage = 'Няма намерени резултати.',
  disabled,
  onCreateNew,
}: IngredientComboboxProps) {
  const [query, setQuery] = React.useState('')

  const trimmedQuery = query.trim()
  const hasExactMatch = options.some(
    (option) => option.label.trim().toLocaleLowerCase('bg') === trimmedQuery.toLocaleLowerCase('bg'),
  )

  const viewOptions: ComboboxOption[] =
    onCreateNew && trimmedQuery && !hasExactMatch
      ? [...options, { value: CREATE_OPTION_VALUE, label: `Създай „${trimmedQuery}“` }]
      : options

  const items = React.useMemo(
    () =>
      BaseCombobox.createItems(viewOptions, {
        getValue: (option) => option.value,
        getLabel: (option) => option.label,
      }),
    [viewOptions],
  )

  return (
    <BaseCombobox.Root
      items={items}
      value={value}
      onValueChange={(next) => {
        if (next === CREATE_OPTION_VALUE) {
          onCreateNew?.(trimmedQuery)
          return
        }
        onChange((next as string | null) ?? null)
      }}
      onInputValueChange={(next) => setQuery(next)}
      disabled={disabled}
    >
      <BaseCombobox.InputGroup className="relative flex h-11 w-full items-center rounded-md border border-input bg-transparent shadow-xs focus-within:ring-2 focus-within:ring-ring/30">
        <BaseCombobox.Input
          placeholder={placeholder}
          className="h-full w-full rounded-md bg-transparent px-3 pr-9 text-base outline-none placeholder:text-muted-foreground md:text-sm"
        />
        <BaseCombobox.Trigger
          className="absolute right-0 flex h-full w-9 items-center justify-center text-muted-foreground"
          aria-label="Отвори списъка"
        >
          <ChevronsUpDown className="size-4" />
        </BaseCombobox.Trigger>
      </BaseCombobox.InputGroup>

      <BaseCombobox.Portal>
        <BaseCombobox.Positioner className="z-50 outline-none" sideOffset={4}>
          <BaseCombobox.Popup className="w-[var(--anchor-width)] max-w-[var(--available-width)] origin-[var(--transform-origin)] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <BaseCombobox.Empty>
              <div className="px-3 py-3 text-sm text-muted-foreground">{emptyMessage}</div>
            </BaseCombobox.Empty>
            <BaseCombobox.List className="max-h-64 overflow-y-auto p-1">
              {(option: ComboboxOption) =>
                option.value === CREATE_OPTION_VALUE ? (
                  <BaseCombobox.Item
                    key={option.value}
                    value={option.value}
                    className="flex cursor-default items-center gap-2 rounded-sm px-2 py-2.5 text-sm text-primary outline-none select-none data-highlighted:bg-accent"
                  >
                    <Plus className="size-4 shrink-0" />
                    <span className="truncate">{option.label}</span>
                  </BaseCombobox.Item>
                ) : (
                  <BaseCombobox.Item
                    key={option.value}
                    value={option.value}
                    className={cn(
                      'grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm px-2 py-2.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground',
                    )}
                  >
                    <BaseCombobox.ItemIndicator className="col-start-1">
                      <Check className="size-3.5" />
                    </BaseCombobox.ItemIndicator>
                    <span className="col-start-2 truncate">{option.label}</span>
                  </BaseCombobox.Item>
                )
              }
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  )
}
