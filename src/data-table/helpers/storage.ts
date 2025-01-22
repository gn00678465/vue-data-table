export interface TableStorageState {
  version: string
  features: {
    visibility?: Record<string, boolean>
  }
}

interface StorageProvider {
  get: (key: string) => Promise<string | null>
  set: (key: string, value: string) => Promise<void>
  remove: (key: string) => Promise<void>
}

/** localStorage */
class LocalStorageProvider implements StorageProvider {
  async get(key: string): Promise<string | null> {
    return localStorage.getItem(key)
  }

  async set(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value)
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key)
  }
}

/** sessionStorage */
class SessionStorageProvider implements StorageProvider {
  async get(key: string): Promise<string | null> {
    return sessionStorage.getItem(key)
  }

  async set(key: string, value: string): Promise<void> {
    sessionStorage.setItem(key, value)
  }

  async remove(key: string): Promise<void> {
    sessionStorage.removeItem(key)
  }
}

/** cookie */
// TODO: wait implement cookie storage

/** constant content */
const CURRENT_VERSION = "1.0.0"
const STORAGE_KEY_PREFIX = "data-table"

/** storage manager */
export class TableStorageManager {
  private provider: StorageProvider
  private storageKey: string

  constructor(
    storageType: "localStorage" | "sessionStorage" | "cookie" = "localStorage",
    storageKey: string,
  ) {
    this.provider = this.createProvider(storageType)
    this.storageKey = `${STORAGE_KEY_PREFIX}-${storageKey}`
  }

  private createProvider(type: string): StorageProvider {
    switch (type) {
      case "localStorage":
        return new LocalStorageProvider()
      case "sessionStorage":
        return new SessionStorageProvider()
      // case 'cookie':
      //   return new CookieStorageProvider()
      default:
        throw new Error(`Unsupported storage type: ${type}`)
    }
  }

  private createInitialState(): TableStorageState {
    return {
      version: CURRENT_VERSION,
      features: {},
    }
  }

  private isVersionCompatible(version: string): boolean {
    // Add version compatibility logic here
    // For now, only accept exact matches
    return version === CURRENT_VERSION
  }

  async getState(): Promise<TableStorageState> {
    try {
      const stored = await this.provider.get(this.storageKey)
      if (!stored) {
        return this.createInitialState()
      }

      const state = JSON.parse(stored) as TableStorageState

      if (!this.isVersionCompatible(state.version)) {
        // Version mismatch - reset to initial state
        const newState = this.createInitialState()
        await this.setState(newState)
        return newState
      }

      return state
    }
    catch (error) {
      console.error("Error reading table state:", error)
      return this.createInitialState()
    }
  }

  async setState(state: TableStorageState): Promise<void> {
    try {
      await this.provider.set(this.storageKey, JSON.stringify(state))
    }
    catch (error) {
      console.error("Error saving table state:", error)
    }
  }

  async updateFeature(
    feature: keyof TableStorageState["features"],
    data: any,
  ): Promise<void> {
    const state = await this.getState()
    state.features[feature] = data
    await this.setState(state)
  }

  async clearState(): Promise<void> {
    try {
      await this.provider.remove(this.storageKey)
    }
    catch (error) {
      console.error("Error clearing table state:", error)
    }
  }
}
