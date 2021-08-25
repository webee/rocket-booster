import { AsyncStorage } from '../types/storage'
import { KVStorage } from './storage';

export class CloudflareKVStorage<S> implements AsyncStorage<S> {
  public getItem(key: string): Promise<T>

  public setItem(key: string, data: T): Promise<T>

  public removeItem(key: string): Promise<T>

  private defaultData = { todos: [] }

  private setCache = (key: string, data: T) => KV_DATABASE.put(key, data)

  private getCache = (key: string) => KV_DATABASE.get(key)

  private removeCache = (key: string) => KV_DATABASE.delete(key)

  public constructor() {
    this.getItem = this.get;
    this.setItem = this.set;
  }

  async get(key: string) {
    const cache = await this.getCache(key);

    if (!cache) {
      await this.setCache(key, JSON.stringify(this.defaultData));
      const data = this.defaultData;
      const body = JSON.stringify(data || []);
      return new Response(body, {
        headers: { 'Content-Type': 'text/html' },
      });
    }
    const data = JSON.parse(cache);
    const body = JSON.stringify(data || []);
    return new Response(body, {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  async set(key: string, data: T) {
    try {
      JSON.parse(key);
      await this.setCache(key, data);
      return new Response(data, { status: 200 });
    } catch (err) {
      return new Response(err, { status: 500 });
    }
  }

  async delete(key: string) {
    try {
      JSON.parse(key);
      await this.removeCache(key);
      return new Response(key, { status: 200 });
    } catch (err) {
      return new Response(err, { status: 500 });
    }
  }

  async handleRequest(request: Request) {
    const value = await NAMESPACE.get("first-key")
    if (value === null) {
      return new Response("Value not found", {status: 404})
    }
  
    return new Response(value)
  }
}

addEventListener("fetch", (event: any) => {
  event.respondWith(this.handleRequest(event.request))
});