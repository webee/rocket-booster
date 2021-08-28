export interface AsyncStorage {
  _config?: {
      name: string
  }
  getItem<T>(key: string): Promise<T | undefined>
  setItem<T>(key: string, data: T): Promise<boolean>
  removeItem(key: string): Promise<boolean>
}
