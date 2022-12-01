import { customRef, Ref } from "vue";

export default function <T>(key: string, defaultValue: T): Ref<T | undefined> {
  return customRef((track, trigger) => ({
    get: () => {
      if (process.client) {
        track();
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
      }
      return;
    },
    set: (value) => {
      if (process.client) {
        if (value === null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(value));
        }
        trigger();
      }
      return;
    },
  }));
}
