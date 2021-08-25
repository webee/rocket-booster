import { AsyncStorage } from '../types/storage'

export class CloudflareKVStorage<S> implements AsyncStorage<S> {
  public getItem<T>: (key: string) => Promise<T>
  public setItem<T>: (key: string, data: T) => Promise<T>
  public removeItem: (key: string) => Promise<void>

  public constructor() {
    
  }
  addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request))
  });
  
  async function handleRequest(request) {
    const value = await NAMESPACE.get("first-key")
    if (value === null) {
      return new Response("Value not found", {status: 404})
    }
  
    return new Response(value)
  }
}