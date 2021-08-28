import { AsyncStorage } from '../types/storage';

export class CloudflareKVStorage implements AsyncStorage {
  private defaultData = {}

  private setCache = <T>(key: string, data: T) => DATABASE.put(key, data)

  private getCache = (key: string) => DATABASE.get(key)

  private removeCache = (key: string) => DATABASE.delete(key)

  async getItem<T>(key: string): Promise<T | undefined> {
    const cache = await this.getCache(key);
    if (!cache) {
      await this.setCache(key, JSON.stringify(this.defaultData));
      return undefined;
    }
    return JSON.parse(cache);
  }

  async removeItem(key: string): Promise<boolean> {
    const cache = await this.getCache(key);
    if (!cache) {
      return false;
    }
    await this.removeCache(key);
    return true;
  }

  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      await this.setCache(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }
}
