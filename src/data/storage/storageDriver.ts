export interface StorageDriver {
  read<T>(key: string): T | null;
  write<T>(key: string, value: T): void;
}

export class BrowserStorageDriver implements StorageDriver {
  constructor(private readonly storage: Storage) {}

  read<T>(key: string): T | null {
    const rawValue = this.storage.getItem(key);

    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as T;
  }

  write<T>(key: string, value: T) {
    this.storage.setItem(key, JSON.stringify(value));
  }
}

export class MemoryStorageDriver implements StorageDriver {
  private readonly store = new Map<string, string>();

  read<T>(key: string): T | null {
    const rawValue = this.store.get(key);
    return rawValue ? (JSON.parse(rawValue) as T) : null;
  }

  write<T>(key: string, value: T) {
    this.store.set(key, JSON.stringify(value));
  }
}
