export interface AsyncStorage {
  _config?: {
      name: string
  }
  getItem<T>(key: string): Promise<T>
  setItem<T>(key: string, data: T): Promise<T>
  removeItem(key: string): Promise<void>
}

/**
 * Options to be used to construct a {@link VuexPersistence} object
 */
 
export interface PersistOptions<S> {
  /**
  * Window.Storage type object. Default is localStorage
  */
  storage?: AsyncStorage

  /**
  * Method to retrieve state from persistence
  * @param key
  * @param [storage]
  */
  restoreState?: (key: string, storage?: AsyncStorage) => Promise<S> | S

  /**
  * Method to save state into persistence
  * @param key
  * @param state
  * @param [storage]
  */
  saveState?: (key: string, state: {}, storage?: AsyncStorage) => Promise<void> | void

  /**
  * Key to use to save the state into the storage
  */
  key?: string

  /**
  * If your storage is async
  * i.e., if setItem(), getItem() etc return Promises
  * (Must be used for asynchronous storages like LocalForage)
  * @default false
  */
  asyncStorage?: boolean
}