import * as React from 'react'
import { Button } from '@/components/ui/button'
import { DecimalInput } from '@/components/ui/decimal-input'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Ingredient } from '@/lib/types'
import { parseDecimal } from '@/lib/utils'
import { useData } from '@/store/data-provider'

interface FormState {
  name: string
  amountGrams: string
  price: string
}

const EMPTY_FORM: FormState = { name: '', amountGrams: '', price: '' }

interface IngredientFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Pass an existing ingredient to edit it; omit/null to create a new one. */
  editing?: Ingredient | null
  /** Pre-fills the name field when creating a new ingredient. */
  initialName?: string
  /** Called after a successful create/update with the resulting ingredient. */
  onSaved?: (ingredient: Ingredient) => void
  /** Element to focus once the dialog finishes closing. */
  finalFocus?: React.RefObject<HTMLElement | null>
}

export function IngredientFormDialog({
  open,
  onOpenChange,
  editing,
  initialName,
  onSaved,
  finalFocus,
}: IngredientFormDialogProps) {
  const { addIngredient, updateIngredient } = useData()
  const [form, setForm] = React.useState<FormState>(EMPTY_FORM)

  React.useEffect(() => {
    if (!open) return
    if (editing) {
      setForm({
        name: editing.name,
        amountGrams: String(editing.amountGrams),
        price: String(editing.price),
      })
    } else {
      setForm({ ...EMPTY_FORM, name: initialName ?? '' })
    }
  }, [open, editing, initialName])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const name = form.name.trim()
    const amountGrams = parseDecimal(form.amountGrams)
    const price = parseDecimal(form.price)
    if (!name || !Number.isFinite(amountGrams) || amountGrams <= 0 || !Number.isFinite(price)) {
      return
    }
    if (editing) {
      await updateIngredient(editing.id, { name, amountGrams, price })
      onOpenChange(false)
      onSaved?.({ ...editing, name, amountGrams, price, updatedAt: Date.now() })
    } else {
      const created = await addIngredient({ name, amountGrams, price })
      onOpenChange(false)
      onSaved?.(created)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent finalFocus={finalFocus}>
        <DialogHeader>
          <DialogTitle>{editing ? 'Редактирай съставка' : 'Нова съставка'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ingredient-name">Име</Label>
            <Input
              id="ingredient-name"
              autoFocus
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Напр. Брашно"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ingredient-amount">Грамаж (г)</Label>
              <DecimalInput
                id="ingredient-amount"
                value={form.amountGrams}
                onChange={(e) => setForm((f) => ({ ...f, amountGrams: e.target.value }))}
                placeholder="1000"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ingredient-price">Цена</Label>
              <DecimalInput
                id="ingredient-price"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="2.50"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отказ
            </Button>
            <Button type="submit">Запази</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
