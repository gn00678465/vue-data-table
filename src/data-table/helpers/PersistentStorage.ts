import type { Ref } from "vue"
import { ref, watch } from "vue"

// 單例存儲實例
export class PersistentStorage {
  private static instance: PersistentStorage | null = null
  private storage: Storage
  private cache: Map<string, Map<string, Ref<any>>> // Changed cache to nested map

  private constructor(storage: Storage = localStorage) {
    this.storage = storage
    this.cache = new Map()
  }

  static getInstance(): PersistentStorage {
    if (!this.instance) {
      this.instance = new PersistentStorage()
    }
    return this.instance
  }

  getState<T>(persistKey: string, stateKey: string, defaultValue: T): Ref<T> {
    if (!this.cache.has(persistKey)) {
      this.cache.set(persistKey, new Map()) // Initialize nested map for persistKey
    }
    if (this.cache.get(persistKey)!.has(stateKey)) {
      return this.cache.get(persistKey)!.get(stateKey)! as Ref<T> // Return from nested map
    }

    const storedState = this.loadState(persistKey)
    const initialState = (storedState && storedState[stateKey]) ? storedState[stateKey] : defaultValue
    const state = ref<T>(initialState) as Ref<T> // Explicitly cast to Ref<T>

    watch(state, (newState) => {
      this.saveState(persistKey, { ...this.loadState(persistKey), [stateKey]: newState }) // Merge state when saving
    }, { deep: true })

    this.cache.get(persistKey)!.set(stateKey, state) // Store in nested map
    return state
  }

  private loadState(persistKey: string): Record<string, any> | null {
    try {
      const item = this.storage.getItem(persistKey)
      return item ? JSON.parse(item) : null
    }
    catch (error) {
      console.error(`Error loading persistent state for key ${persistKey}: ${error}`)
      return null
    }
  }

  private saveState(persistKey: string, state: Record<string, any>): void {
    try {
      this.storage.setItem(persistKey, JSON.stringify(state))
    }
    catch (error) {
      console.error(`Error saving persistent state for key ${persistKey}: ${error}`)
    }
  }

  clearState(persistKey: string): void {
    this.storage.removeItem(persistKey)
    this.cache.delete(persistKey)
  }

  clearSubState(persistKey: string, stateKey: string): void {
    const storedState = this.loadState(persistKey) || {}
    delete storedState[stateKey]
    this.saveState(persistKey, storedState)
    if (this.cache.has(persistKey)) {
      this.cache.get(persistKey)!.delete(stateKey)
    }
  }
}
