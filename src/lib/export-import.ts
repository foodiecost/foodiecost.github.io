import { ingredientsRepo, itemsRepo, settingsRepo } from './db'
import type { ExportPayload } from './types'

export async function buildExportPayload(): Promise<ExportPayload> {
  const [ingredients, items, settings] = await Promise.all([
    ingredientsRepo.getAll(),
    itemsRepo.getAll(),
    settingsRepo.get(),
  ])
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    ingredients,
    items,
    settings,
  }
}

export function downloadExportFile(payload: ExportPayload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `foodiecost-export-${date}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function parseImportFile(text: string): ExportPayload {
  const data = JSON.parse(text)
  if (!data || typeof data !== 'object') throw new Error('Невалиден файл')
  if (!Array.isArray(data.ingredients) || !Array.isArray(data.items)) {
    throw new Error('Невалиден формат на файла')
  }
  return data as ExportPayload
}

export async function applyImportPayload(payload: ExportPayload) {
  await ingredientsRepo.replaceAll(payload.ingredients)
  await itemsRepo.replaceAll(payload.items)
  if (payload.settings) {
    await settingsRepo.put(payload.settings)
  }
}
