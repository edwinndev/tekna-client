import { createJSONStorage } from "jotai/utils";

interface StringStorageLike {
  getItem: (key: string) => string | null;
  setItem: (key: string, newValue: string) => void;
  removeItem: (key: string) => void;
}

const dummyStorage: StringStorageLike = {
  getItem: (): string | null => null,
  setItem: (): void => {},
  removeItem: (): void => {},
};

export function createLocalStorageAdapter<T>() {
  return createJSONStorage<T>((): StringStorageLike => {
    if (typeof window === "undefined") {
      return dummyStorage;
    }

    return {
      getItem: (key: string): string | null => {
        try {
          const value: string | null = window.localStorage.getItem(key);
          if (value === null) {
            return null;
          }
          if (
            value.startsWith("{") ||
            value.startsWith("[") ||
            value.startsWith('"') ||
            value === "true" ||
            value === "false" ||
            value === "null"
          ) {
            return value;
          }
          return JSON.stringify(value);
        } catch {
          return null;
        }
      },
      setItem: (key: string, newValue: string): void => {
        try {
          window.localStorage.setItem(key, newValue);
        } catch {
          // Silently catch storage errors
        }
      },
      removeItem: (key: string): void => {
        try {
          window.localStorage.removeItem(key);
        } catch {
          // Silently catch storage errors
        }
      },
    };
  });
}
