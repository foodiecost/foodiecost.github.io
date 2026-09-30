import { Pencil, Trash2, Wheat } from 'lucide-react'
import * as React from 'react'
import { FloatingActionButton } from '@/components/layout/floating-action-button'
import { PageHeader } from '@/components/layout/page-header'
import { SettingsLinkButton } from '@/components/layout/settings-link-button'
import { IngredientFormDialog } from '@/components/ingredient-form-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { costPerGram } from '@/lib/calculations'
import type { Ingredient } from '@/lib/types'
import { formatMoney } from '@/lib/utils'
import { useData } from '@/store/data-provider'

export function IngredientsPage() {
  const { ingredients, items, deleteIngredient } = useData()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Ingredient | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<Ingredient | null>(null)

  const sorted = React.useMemo(
    () => [...ingredients].sort((a, b) => a.name.localeCompare(b.name, 'bg')),
    [ingredients],
  )

  const itemsUsingIngredient = React.useCallback(
    (ingredientId: string) =>
      items.filter((item) => item.ingredients.some((line) => line.ingredientId === ingredientId)),
    [items],
  )

  const blockingItems = deleteTarget ? itemsUsingIngredient(deleteTarget.id) : []

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(ingredient: Ingredient) {
    setEditing(ingredient)
    setDialogOpen(true)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    if (itemsUsingIngredient(deleteTarget.id).length > 0) return
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

      <IngredientFormDialog open={dialogOpen} onOpenChange={setDialogOpen} editing={editing} />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изтриване на съставка</DialogTitle>
          </DialogHeader>
          {blockingItems.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">
                "{deleteTarget?.name}" не може да бъде изтрита, защото се използва в следните
                артикули: {blockingItems.map((item) => item.name).join(', ')}.
                <br /><br />
                Премахнете я от тях, за да можете да я изтриете.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                  Разбрах
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Сигурни ли сте, че искате да изтриете "{deleteTarget?.name}"?
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                  Отказ
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Изтрий
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
