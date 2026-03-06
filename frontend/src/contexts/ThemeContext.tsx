import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

const THEME_KEY = "algolens-theme";
const isExtension = typeof chrome !== "undefined" && chrome.storage?.local;

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("dark");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const apply = (t: Theme) => {
      setTheme(t);
      document.documentElement.setAttribute("data-theme", t);
    };
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const fallback: Theme = systemPrefersDark ? "dark" : "light";

    if (isExtension) {
      chrome.storage.local.get([THEME_KEY], (res) => {
        const saved = (res[THEME_KEY] as Theme) || null;
        apply(saved || fallback);
      });
    } else {
      const saved = localStorage.getItem(THEME_KEY) as Theme | null;
      apply(saved || fallback);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (isExtension) {
        chrome.storage.local.get([THEME_KEY], (res) => {
          if (!res[THEME_KEY]) apply(e.matches ? "dark" : "light");
        });
      } else if (!localStorage.getItem(THEME_KEY)) {
        apply(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setIsTransitioning(true);
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    if (isExtension) chrome.storage.local.set({ [THEME_KEY]: next });
    else localStorage.setItem(THEME_KEY, next);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  useEffect(() => {
    if (isTransitioning) {
      document.documentElement.classList.add("theme-transitioning");
    } else {
      document.documentElement.classList.remove("theme-transitioning");
    }
  }, [isTransitioning]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
