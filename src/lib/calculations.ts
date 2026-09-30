import type { Ingredient, Item, Settings } from './types'

export interface IngredientLineCost {
  ingredientId: string
  name: string
  amountGrams: number
  cost: number
  /** true, ако съставката вече не съществува (изтрита) */
  missing: boolean
}

export interface ItemCostBreakdown {
  lines: IngredientLineCost[]
  ingredientsCost: number
  laborCost: number
  electricityCost: number
  totalBatchCost: number
  costPerUnit: number
}

export function costPerGram(ingredient: Ingredient): number {
  if (ingredient.amountGrams <= 0) return 0
  return ingredient.price / ingredient.amountGrams
}

export function calculateItemCost(
  item: Item,
  ingredientsById: Map<string, Ingredient>,
  settings: Settings,
): ItemCostBreakdown {
  const lines: IngredientLineCost[] = item.ingredients.map((line) => {
    const ingredient = ingredientsById.get(line.ingredientId)
    if (!ingredient) {
      return {
        ingredientId: line.ingredientId,
        name: '(изтрита съставка)',
        amountGrams: line.amountGrams,
        cost: 0,
        missing: true,
      }
    }
    return {
      ingredientId: line.ingredientId,
      name: ingredient.name,
      amountGrams: line.amountGrams,
      cost: costPerGram(ingredient) * line.amountGrams,
      missing: false,
    }
  })

  const ingredientsCost = lines.reduce((sum, line) => sum + line.cost, 0)
  const laborCost = ((item.prepTimeMinutes ?? 0) / 60) * settings.laborRatePerHour
  const electricityCost =
    ((item.bakingTimeMinutes ?? 0) / 60) * settings.ovenPowerKw * settings.electricityPricePerKwh

  const totalBatchCost = ingredientsCost + laborCost + electricityCost
  const producedCount = item.producedCount > 0 ? item.producedCount : 1
  const costPerUnit = totalBatchCost / producedCount

  return {
    lines,
    ingredientsCost,
    laborCost,
    electricityCost,
    totalBatchCost,
    costPerUnit,
  }
}
