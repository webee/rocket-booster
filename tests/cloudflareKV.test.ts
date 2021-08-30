import {
  CloudflareKVStorage,
} from '../src/storage';

declare const global: any;

const kvStorage = new CloudflareKVStorage();

interface StorageMock {
  store: Record<string, string>;
  get(key: string): string | undefined;
  put(key: string, value: string): void;
  delete(key: string): void;
}
class LocalStorageMock implements StorageMock {
  public store: Record<string, string>;

  constructor() {
    this.store = {};
  }

  clear(): void {
    this.store = {};
  }

  get(key: string): string | undefined {
    return this.store[key] || undefined;
  }

  put(key: string, value: string): void {
    this.store[key] = String(value);
  }

  delete(key: string): void {
    delete this.store[key];
  }
}

const DATABASE = new LocalStorageMock();
export default DATABASE;

test('storage.ts -> putItem()', async () => {
  expect(await kvStorage.setItem('key', 12345)).toBeTruthy();
});

test('storage.ts -> getItem()', async () => {
  expect(await kvStorage.setItem('key', 12345)).toBeTruthy();
  expect(await kvStorage.getItem('key')).toBe(12345);
});

test('storage.ts -> removeItem()', async () => {
  expect(await kvStorage.setItem('key', 12345)).toBeTruthy();
  expect(await kvStorage.getItem('key')).toBe(12345);
  expect(await kvStorage.removeItem('key')).toBeTruthy();
  expect(await kvStorage.removeItem('key')).toBeFalsy();
  expect(await kvStorage.getItem('key')).toBe(undefined);
});
