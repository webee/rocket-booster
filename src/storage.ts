import {PersistOptions, AsyncStorage } from '../types/storage'

export class KVStorage<S> implements PersistOptions<S> {
    public storage: AsyncStorage | undefined
    public restoreState: (key: string, storage?: AsyncStorage | Storage) => Promise<S> | S
    public saveState: (key: string, state: {}, storage?: AsyncStorage | Storage) => Promise<void> | void

    public constructor(options?: PersistOptions<S>) {
        if (typeof options === 'undefined') options = {} as PersistOptions<S>
        /**
         * 1. First, prefer storage sent in optinos
         * 2. Otherwise, use window.localStorage if available
         * 3. Finally, try to use MockStorage
         * 4. None of above? Well we gotta fail.
         */
        if (options.storage) { this.storage = options.storage }
        else { this.storage =  }

        /**
       * Async {@link #VuexPersistence.restoreState} implementation
       * @type {((key: string, storage?: Storage) =>
       *      (Promise<S> | S)) | ((key: string, storage: AsyncStorage) => Promise<any>)}
         */
        this.restoreState = (
          (options.restoreState != null)
            ? options.restoreState
            : ((key: string, storage: AsyncStorage) =>
              (storage).getItem(key)
                .then((value) => (value || {})
                )
            )
        )
  
        /**
         * Async {@link #VuexPersistence.saveState} implementation
         * @type {((key: string, state: {}, storage?: Storage) =>
         *    (Promise<void> | void)) | ((key: string, state: {}, storage?: Storage) => Promise<void>)}
         */
        this.saveState = (
          (options.saveState != null)
            ? options.saveState
            : ((key: string, state: {}, storage: AsyncStorage) =>
              (storage).setItem(
                key, // Second argument is state _object_ if asyc storage, stringified otherwise
                // do not stringify the state if the storage type is async
                (merge({}, state || {}, this.mergeOption))
              )
            )
        )
  
    }
}