import { type DBSchema, type IDBPDatabase, openDB } from 'idb'
import { DEFAULT_SETTINGS, type Ingredient, type Item, type Settings } from './types'

interface FoodieCostDB extends DBSchema {
  ingredients: {
    key: string
    value: Ingredient
    indexes: { 'by-name': string }
  }
  items: {
    key: string
    value: Item
    indexes: { 'by-name': string }
  }
  settings: {
    key: string
    value: Settings
  }
}

const DB_NAME = 'foodiecost'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<FoodieCostDB>> | undefined

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<FoodieCostDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const ingredients = db.createObjectStore('ingredients', { keyPath: 'id' })
        ingredients.createIndex('by-name', 'name')

        const items = db.createObjectStore('items', { keyPath: 'id' })
        items.createIndex('by-name', 'name')

        db.createObjectStore('settings', { keyPath: 'id' })
      },
    })
  }
  return dbPromise
}

export const ingredientsRepo = {
  async getAll(): Promise<Ingredient[]> {
    const db = await getDb()
    return db.getAll('ingredients')
  },
  async put(ingredient: Ingredient): Promise<void> {
    const db = await getDb()
    await db.put('ingredients', ingredient)
  },
  async remove(id: string): Promise<void> {
    const db = await getDb()
    await db.delete('ingredients', id)
  },
  async replaceAll(ingredients: Ingredient[]): Promise<void> {
    const db = await getDb()
    const tx = db.transaction('ingredients', 'readwrite')
    await tx.store.clear()
    for (const ingredient of ingredients) {
      await tx.store.put(ingredient)
    }
    await tx.done
  },
}

export const itemsRepo = {
  async getAll(): Promise<Item[]> {
    const db = await getDb()
    return db.getAll('items')
  },
  async put(item: Item): Promise<void> {
    const db = await getDb()
    await db.put('items', item)
  },
  async remove(id: string): Promise<void> {
    const db = await getDb()
    await db.delete('items', id)
  },
  async replaceAll(items: Item[]): Promise<void> {
    const db = await getDb()
    const tx = db.transaction('items', 'readwrite')
    await tx.store.clear()
    for (const item of items) {
      await tx.store.put(item)
    }
    await tx.done
  },
}

export const settingsRepo = {
  async get(): Promise<Settings> {
    const db = await getDb()
    const existing = await db.get('settings', 'settings')
    return existing ?? DEFAULT_SETTINGS
  },
  async put(settings: Settings): Promise<void> {
    const db = await getDb()
    await db.put('settings', settings)
  },
}
