import { ChefHat, Search } from 'lucide-react'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { FloatingActionButton } from '@/components/layout/floating-action-button'
import { PageHeader } from '@/components/layout/page-header'
import { SettingsLinkButton } from '@/components/layout/settings-link-button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { calculateItemCost } from '@/lib/calculations'
import { formatMoney } from '@/lib/utils'
import { useData } from '@/store/data-provider'

export function ItemsPage() {
  const { items, ingredientsById, settings, loading } = useData()
  const navigate = useNavigate()
  const [query, setQuery] = React.useState('')

  const filtered = React.useMemo(() => {
    const q = query.trim().toLocaleLowerCase('bg')
    const list = q ? items.filter((item) => item.name.toLocaleLowerCase('bg').includes(q)) : items
    return [...list].sort((a, b) => b.updatedAt - a.updatedAt)
  }, [items, query])

  return (
    <div>
      <PageHeader title="Артикули" left={<SettingsLinkButton />} />

      <div className="p-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Търсене на артикул..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4 pt-2">
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
            <ChefHat className="size-10 opacity-40" />
            <p className="text-sm">
              {items.length === 0
                ? 'Все още нямате въведени артикули. Натиснете "+", за да добавите първия.'
                : 'Няма намерени артикули.'}
            </p>
          </div>
        )}

        {filtered.map((item) => {
          const cost = calculateItemCost(item, ingredientsById, settings)
          return (
            <Card
              key={item.id}
              onClick={() => navigate(`/items/${item.id}`)}
              className="cursor-pointer p-4 transition-colors hover:bg-accent/50"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Партида от {item.producedCount} бр.
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-semibold">{formatMoney(cost.costPerUnit)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatMoney(cost.totalBatchCost)} общо
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <FloatingActionButton
        aria-label="Добави артикул"
        onClick={() => navigate('/items/new')}
      />
    </div>
  )
}
