import { AsyncStorage } from '../types/storage';

export class CloudflareKVStorage implements AsyncStorage {

  private defaultData = { todos: [] }

  private setCache = (key: string, data: T) => KV_DATABASE.put(key, data)

  private getCache = (key: string) => KV_DATABASE.get(key)

  private removeCache = (key: string) => KV_DATABASE.delete(key)

  public constructor() {
    this.removeItem = this.delete;
  }

  async getItem<T>(key: string): Promise<T> {
    const cache = await this.getCache(key);

    if (!cache) {
      await this.setCache(key, JSON.stringify(this.defaultData));
      const data = this.defaultData;
      const body = JSON.stringify(data || []);
      return body;
    }
    const data = JSON.parse(cache);
    const body = JSON.stringify(data || []);
    return body;
  }

  async setItem<T>(key: string, data: T): Promise<T> {
    try {
      JSON.parse(key);
      await this.setCache(key, data);
      return data;
    } catch (err) {
      return data;
    }
  }

  async removeItem(key: string): Promise<Void> {
    try {
      JSON.parse(key);
      await this.removeCache(key);
    } catch (err) {
    }
  }

  
}

async handleRequest(request: Request) {
  const value = await NAMESPACE.get("first-key");
  if (value === null) {
    return new Response("Value not found", {status: 404});
  }

  return new Response(value)
};

addEventListener("fetch", (event: any) => {
  event.respondWith(handleRequest(event.request));
});