export interface Ingredient {
  id: string
  name: string
  /** Грамаж, за който се отнася цената (в грамове) */
  amountGrams: number
  /** Цена за amountGrams */
  price: number
  createdAt: number
  updatedAt: number
}

export interface ItemIngredientLine {
  ingredientId: string
  /** Използван грамаж от тази съставка за целия batch */
  amountGrams: number
}

export interface Item {
  id: string
  name: string
  /** Колко готови артикула се получават от този batch */
  producedCount: number
  ingredients: ItemIngredientLine[]
  /** Време за печене в минути (опционално) */
  bakingTimeMinutes?: number
  /** Време за приготвяне (ръчен труд) в минути (опционално) */
  prepTimeMinutes?: number
  createdAt: number
  updatedAt: number
}

export type ThemeMode = 'light' | 'dark' | 'auto'

export interface Settings {
  id: 'settings'
  theme: ThemeMode
  /** Цена на труда за час в евро */
  laborRatePerHour: number
  /** Цена на тока за kWh */
  electricityPricePerKwh: number
  /** Приблизителна мощност на фурна/уред в kW, ползвана за оценка на ток при печене */
  ovenPowerKw: number
}

export const DEFAULT_SETTINGS: Settings = {
  id: 'settings',
  theme: 'auto',
  laborRatePerHour: 0,
  electricityPricePerKwh: 0.13,
  ovenPowerKw: 2.5,
}

export interface ExportPayload {
  version: 1
  exportedAt: string
  ingredients: Ingredient[]
  items: Item[]
  settings: Settings
}
