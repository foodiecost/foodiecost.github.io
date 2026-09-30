import { Pencil, Trash2, Wheat } from 'lucide-react'
import * as React from 'react'
import { FloatingActionButton } from '@/components/layout/floating-action-button'
import { PageHeader } from '@/components/layout/page-header'
import { SettingsLinkButton } from '@/components/layout/settings-link-button'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { costPerGram } from '@/lib/calculations'
import type { Ingredient } from '@/lib/types'
import { formatMoney } from '@/lib/utils'
import { useData } from '@/store/data-provider'

interface FormState {
  name: string
  amountGrams: string
  price: string
}

const EMPTY_FORM: FormState = { name: '', amountGrams: '', price: '' }

export function IngredientsPage() {
  const { ingredients, addIngredient, updateIngredient, deleteIngredient } = useData()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Ingredient | null>(null)
  const [form, setForm] = React.useState<FormState>(EMPTY_FORM)
  const [deleteTarget, setDeleteTarget] = React.useState<Ingredient | null>(null)

  const sorted = React.useMemo(
    () => [...ingredients].sort((a, b) => a.name.localeCompare(b.name, 'bg')),
    [ingredients],
  )

  function openAdd() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  function openEdit(ingredient: Ingredient) {
    setEditing(ingredient)
    setForm({
      name: ingredient.name,
      amountGrams: String(ingredient.amountGrams),
      price: String(ingredient.price),
    })
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const name = form.name.trim()
    const amountGrams = Number.parseFloat(form.amountGrams)
    const price = Number.parseFloat(form.price)
    if (!name || !Number.isFinite(amountGrams) || amountGrams <= 0 || !Number.isFinite(price)) {
      return
    }
    if (editing) {
      await updateIngredient(editing.id, { name, amountGrams, price })
    } else {
      await addIngredient({ name, amountGrams, price })
    }
    setDialogOpen(false)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    await deleteIngredient(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div>
      <PageHeader title="Съставки" left={<SettingsLinkButton />} />

      <div className="flex flex-col gap-2 p-4">
        {sorted.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
            <Wheat className="size-10 opacity-40" />
            <p className="text-sm">
              Все още нямате въведени съставки. Натиснете "+", за да добавите първата.
            </p>
          </div>
        )}

        {sorted.map((ingredient) => (
          <Card key={ingredient.id} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium">{ingredient.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatMoney(ingredient.price)} / {ingredient.amountGrams} г · {' '}
                {formatMoney(costPerGram(ingredient))}/г
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="icon" aria-label="Редактирай" onClick={() => openEdit(ingredient)}>
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Изтрий"
                onClick={() => setDeleteTarget(ingredient)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <FloatingActionButton aria-label="Добави съставка" onClick={openAdd} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Редактирай съставка' : 'Нова съставка'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
                <Input
                  id="ingredient-amount"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={form.amountGrams}
                  onChange={(e) => setForm((f) => ({ ...f, amountGrams: e.target.value }))}
                  placeholder="1000"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ingredient-price">Цена</Label>
                <Input
                  id="ingredient-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="2.50"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Отказ
              </Button>
              <Button type="submit">Запази</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изтриване на съставка</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Сигурни ли сте, че искате да изтриете "{deleteTarget?.name}"? Артикули, които я
            използват, ще покажат съставка като изтрита.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Отказ
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Изтрий
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
