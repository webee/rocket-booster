import { AsyncStorage, CloudflareKVConfig } from '../types/storage'

export class CloudflareKVStorage implements AsyncStorage {
  private defaultData = {}

  private setCache = <T>(key: string, data: T) => DATABASE.put(key, data)
  private getCache = (key: string) => DATABASE.get(key)
  private removeCache = (key: string) => DATABASE.delete(key)

  async getItem(key: string) {
    const cache = await this.getCache(key)
    if (!cache) {
      await this.setCache(key, JSON.stringify(this.defaultData))
      return this.defaultData
    } else {
      return JSON.parse(cache)
    }
  }

  async removeItem(key: string) {
    const cache = await this.getCache(key)
    if (!cache) {
      return false
    } else {
      this.removeCache(key)
      return true
    }
  }

  async setItem<T>(key: string, value: T) {
    try {
      await this.setCache(key, value)
      return true
    } catch (err) {
      return false
    }
  }
}