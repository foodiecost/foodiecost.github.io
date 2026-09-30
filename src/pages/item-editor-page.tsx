import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ComboboxOption } from '@/components/ui/combobox'
import { SearchCombobox } from '@/components/ui/combobox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { calculateItemCost } from '@/lib/calculations'
import type { ItemIngredientLine } from '@/lib/types'
import { formatMoney, uid } from '@/lib/utils'
import { useData } from '@/store/data-provider'

interface DraftLine {
  key: string
  ingredientId: string | null
  amountGrams: string
}

function toDraftLines(lines: ItemIngredientLine[]): DraftLine[] {
  return lines.map((line) => ({
    key: uid(),
    ingredientId: line.ingredientId,
    amountGrams: String(line.amountGrams),
  }))
}

export function ItemEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { items, ingredients, ingredientsById, settings, addItem, updateItem, deleteItem } =
    useData()

  const existing = React.useMemo(() => items.find((item) => item.id === id), [items, id])
  const isEditing = !!existing

  const [name, setName] = React.useState('')
  const [producedCount, setProducedCount] = React.useState('1')
  const [bakingTimeHours, setBakingTimeHours] = React.useState('')
  const [prepTimeHours, setPrepTimeHours] = React.useState('')
  const [lines, setLines] = React.useState<DraftLine[]>([])
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const initializedFor = React.useRef<string | undefined>(undefined)

  React.useEffect(() => {
    const key = existing?.id ?? 'new'
    if (initializedFor.current === key) return
    initializedFor.current = key
    if (existing) {
      setName(existing.name)
      setProducedCount(String(existing.producedCount))
      setBakingTimeHours(existing.bakingTimeHours ? String(existing.bakingTimeHours) : '')
      setPrepTimeHours(existing.prepTimeHours ? String(existing.prepTimeHours) : '')
      setLines(toDraftLines(existing.ingredients))
    } else {
      setName('')
      setProducedCount('1')
      setBakingTimeHours('')
      setPrepTimeHours('')
      setLines([])
    }
  }, [existing])

  const ingredientOptions: ComboboxOption[] = React.useMemo(
    () =>
      [...ingredients]
        .sort((a, b) => a.name.localeCompare(b.name, 'bg'))
        .map((ingredient) => ({ value: ingredient.id, label: ingredient.name })),
    [ingredients],
  )

  function optionsForLine(currentKey: string): ComboboxOption[] {
    const usedElsewhere = new Set(
      lines.filter((l) => l.key !== currentKey && l.ingredientId).map((l) => l.ingredientId),
    )
    return ingredientOptions.filter((option) => !usedElsewhere.has(option.value))
  }

  function addLine() {
    setLines((prev) => [...prev, { key: uid(), ingredientId: null, amountGrams: '' }])
  }

  function updateLine(key: string, patch: Partial<DraftLine>) {
    setLines((prev) => prev.map((line) => (line.key === key ? { ...line, ...patch } : line)))
  }

  function removeLine(key: string) {
    setLines((prev) => prev.filter((line) => line.key !== key))
  }

  const draftItem = React.useMemo(() => {
    const parsedIngredients: ItemIngredientLine[] = lines
      .filter((line) => line.ingredientId)
      .map((line) => ({
        ingredientId: line.ingredientId!,
        amountGrams: Number.parseFloat(line.amountGrams) || 0,
      }))
    return {
      id: existing?.id ?? 'draft',
      name: name.trim() || '(без име)',
      producedCount: Number.parseFloat(producedCount) || 1,
      ingredients: parsedIngredients,
      bakingTimeHours: bakingTimeHours ? Number.parseFloat(bakingTimeHours) : undefined,
      prepTimeHours: prepTimeHours ? Number.parseFloat(prepTimeHours) : undefined,
      createdAt: existing?.createdAt ?? 0,
      updatedAt: existing?.updatedAt ?? 0,
    }
  }, [existing, name, producedCount, lines, bakingTimeHours, prepTimeHours])

  const cost = React.useMemo(
    () => calculateItemCost(draftItem, ingredientsById, settings),
    [draftItem, ingredientsById, settings],
  )

  const isValid =
    name.trim().length > 0 &&
    Number.parseFloat(producedCount) > 0 &&
    lines.every((line) => line.ingredientId && Number.parseFloat(line.amountGrams) > 0)

  async function handleSave() {
    if (!isValid) return
    const payload = {
      name: name.trim(),
      producedCount: Number.parseFloat(producedCount) || 1,
      ingredients: draftItem.ingredients,
      bakingTimeHours: bakingTimeHours ? Number.parseFloat(bakingTimeHours) : undefined,
      prepTimeHours: prepTimeHours ? Number.parseFloat(prepTimeHours) : undefined,
    }
    if (existing) {
      await updateItem(existing.id, payload)
    } else {
      await addItem(payload)
    }
    navigate('/')
  }

  async function confirmDelete() {
    if (!existing) return
    await deleteItem(existing.id)
    setDeleteOpen(false)
    navigate('/')
  }

  return (
    <div>
      <PageHeader
        title={isEditing ? 'Редактиране на артикул' : 'Нов артикул'}
        left={
          <Button variant="ghost" size="icon" aria-label="Назад" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-5" />
          </Button>
        }
        right={
          isEditing ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Изтрий"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-4" />
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-col gap-4 p-4">
        <Card>
          <CardContent className="flex flex-col gap-3 pt-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="item-name">Име на артикула</Label>
              <Input
                id="item-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Напр. Шоколадови бисквитки"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="item-produced-count">Брой готови артикули от тази партида</Label>
              <Input
                id="item-produced-count"
                type="number"
                inputMode="decimal"
                min="1"
                step="any"
                value={producedCount}
                onChange={(e) => setProducedCount(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="item-baking-time">Печене (ч.), опц.</Label>
                <Input
                  id="item-baking-time"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={bakingTimeHours}
                  onChange={(e) => setBakingTimeHours(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="item-prep-time">Труд (ч.), опц.</Label>
                <Input
                  id="item-prep-time"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={prepTimeHours}
                  onChange={(e) => setPrepTimeHours(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Съставки</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {lines.length === 0 && (
              <p className="text-sm text-muted-foreground">Няма добавени съставки.</p>
            )}
            {lines.map((line) => (
              <div key={line.key} className="flex items-start gap-2">
                <div className="flex-1">
                  <SearchCombobox
                    options={optionsForLine(line.key)}
                    value={line.ingredientId}
                    onChange={(value) => updateLine(line.key, { ingredientId: value })}
                    placeholder="Избери съставка..."
                    emptyMessage="Няма такава съставка."
                  />
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    placeholder="грамове"
                    value={line.amountGrams}
                    onChange={(e) => updateLine(line.key, { amountGrams: e.target.value })}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Премахни"
                  onClick={() => removeLine(line.key)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addLine} disabled={ingredientOptions.length === 0}>
              <Plus className="size-4" />
              Добави съставка
            </Button>
            {ingredients.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Нямате въведени съставки. Добавете такива от раздел "Съставки".
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Себестойност</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Съставки</span>
              <span>{formatMoney(cost.ingredientsCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Труд</span>
              <span>{formatMoney(cost.laborCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ток (печене)</span>
              <span>{formatMoney(cost.electricityCost)}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-border pt-1.5 font-semibold">
              <span>Общо за партидата</span>
              <span>{formatMoney(cost.totalBatchCost)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-primary">
              <span>За 1 бройка</span>
              <span>{formatMoney(cost.costPerUnit)}</span>
            </div>
          </CardContent>
        </Card>

        <Button size="lg" disabled={!isValid} onClick={handleSave}>
          Запази
        </Button>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изтриване на артикул</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Сигурни ли сте, че искате да изтриете "{existing?.name}"?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
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
