import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return '0.00 €'
  return `${value.toLocaleString('bg-BG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
}

export function uid(): string {
  return crypto.randomUUID()
}

/** Parses a number typed by the user, accepting both "," and "." as decimal separator. */
export function parseDecimal(value: string): number {
  return Number.parseFloat(value.replace(',', '.'))
}
