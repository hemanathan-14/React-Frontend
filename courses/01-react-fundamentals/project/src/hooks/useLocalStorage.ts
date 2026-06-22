import { useState } from "react";

export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): [
  T,
  React.Dispatch<
    React.SetStateAction<T>
  >
] {
  const [storedValue, setStoredValue] =
    useState<T>(() => {
      try {
        const item =
          localStorage.getItem(key);

        if (item !== null) {
          return JSON.parse(item);
        }

        return initialValue;
      } catch {
        return initialValue;
      }
    });

  const setValue: React.Dispatch<
  React.SetStateAction<T>
> = (value) => {
  const valueToStore =
    value instanceof Function
      ? value(storedValue)
      : value;

  setStoredValue(valueToStore);

  try {
    const serialized =
      JSON.stringify(valueToStore);

    localStorage.setItem(
      key,
      serialized
    );
  } catch {
    // ignore errors
  }
};

  return [storedValue, setValue];
}