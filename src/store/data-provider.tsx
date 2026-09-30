import * as React from 'react'
import { ingredientsRepo, itemsRepo, settingsRepo } from '@/lib/db'
import { DEFAULT_SETTINGS, type Ingredient, type Item, type Settings } from '@/lib/types'
import { uid } from '@/lib/utils'

interface DataContextValue {
  loading: boolean
  ingredients: Ingredient[]
  items: Item[]
  settings: Settings
  ingredientsById: Map<string, Ingredient>
  addIngredient: (input: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Ingredient>
  updateIngredient: (
    id: string,
    input: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<void>
  deleteIngredient: (id: string) => Promise<void>
  addItem: (input: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Item>
  updateItem: (id: string, input: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  updateSettings: (settings: Settings) => Promise<void>
  reloadAll: () => Promise<void>
}

const DataContext = React.createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState(true)
  const [ingredients, setIngredients] = React.useState<Ingredient[]>([])
  const [items, setItems] = React.useState<Item[]>([])
  const [settings, setSettings] = React.useState<Settings>(DEFAULT_SETTINGS)

  const reloadAll = React.useCallback(async () => {
    const [nextIngredients, nextItems, nextSettings] = await Promise.all([
      ingredientsRepo.getAll(),
      itemsRepo.getAll(),
      settingsRepo.get(),
    ])
    setIngredients(nextIngredients)
    setItems(nextItems)
    setSettings(nextSettings)
  }, [])

  React.useEffect(() => {
    reloadAll().finally(() => setLoading(false))
  }, [reloadAll])

  const ingredientsById = React.useMemo(
    () => new Map(ingredients.map((ingredient) => [ingredient.id, ingredient])),
    [ingredients],
  )

  const addIngredient: DataContextValue['addIngredient'] = React.useCallback(async (input) => {
    const now = Date.now()
    const ingredient: Ingredient = { ...input, id: uid(), createdAt: now, updatedAt: now }
    await ingredientsRepo.put(ingredient)
    setIngredients((prev) => [...prev, ingredient])
    return ingredient
  }, [])

  const updateIngredient: DataContextValue['updateIngredient'] = React.useCallback(
    async (id, input) => {
      setIngredients((prev) => {
        const existing = prev.find((ingredient) => ingredient.id === id)
        if (!existing) return prev
        const updated: Ingredient = { ...existing, ...input, updatedAt: Date.now() }
        ingredientsRepo.put(updated)
        return prev.map((ingredient) => (ingredient.id === id ? updated : ingredient))
      })
    },
    [],
  )

  const deleteIngredient: DataContextValue['deleteIngredient'] = React.useCallback(async (id) => {
    await ingredientsRepo.remove(id)
    setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id))
  }, [])

  const addItem: DataContextValue['addItem'] = React.useCallback(async (input) => {
    const now = Date.now()
    const item: Item = { ...input, id: uid(), createdAt: now, updatedAt: now }
    await itemsRepo.put(item)
    setItems((prev) => [...prev, item])
    return item
  }, [])

  const updateItem: DataContextValue['updateItem'] = React.useCallback(async (id, input) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (!existing) return prev
      const updated: Item = { ...existing, ...input, updatedAt: Date.now() }
      itemsRepo.put(updated)
      return prev.map((item) => (item.id === id ? updated : item))
    })
  }, [])

  const deleteItem: DataContextValue['deleteItem'] = React.useCallback(async (id) => {
    await itemsRepo.remove(id)
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateSettings: DataContextValue['updateSettings'] = React.useCallback(
    async (next) => {
      await settingsRepo.put(next)
      setSettings(next)
    },
    [],
  )

  const value: DataContextValue = {
    loading,
    ingredients,
    items,
    settings,
    ingredientsById,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    addItem,
    updateItem,
    deleteItem,
    updateSettings,
    reloadAll,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = React.useContext(DataContext)
  if (!ctx) throw new Error('useData трябва да се използва в DataProvider')
  return ctx
}
