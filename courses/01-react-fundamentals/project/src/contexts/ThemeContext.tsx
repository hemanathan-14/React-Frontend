import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext =
  createContext<ThemeContextValue | null>(
    null
  );

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] =
    useState<Theme>(() => {
      const saved =
        localStorage.getItem(
          "task-app-theme"
        );

      return saved === "dark"
        ? "dark"
        : "light";
    });

  useEffect(() => {
    localStorage.setItem(
      "task-app-theme",
      theme
    );

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );
  }, [theme]);

  function setTheme(theme: Theme) {
    setThemeState(theme);
  }

  function toggleTheme() {
    setThemeState((prev) =>
      prev === "light"
        ? "dark"
        : "light"
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx =
    useContext(ThemeContext);

  if (!ctx) {
    throw new Error(
      "useTheme must be used within ThemeProvider"
    );
  }

  return ctx;
}