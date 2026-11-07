"use client";

import { createContext, useContext, useState, useCallback } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "dark", toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeScript() {
  // Runs before hydration — sets the theme class with no flash.
  const code = `(function(){try{var t=localStorage.getItem("nx-theme");if(t!=="light"&&t!=="dark"){t="dark"}var d=document.documentElement;d.classList.toggle("light",t==="light");d.classList.toggle("dark",t!=="light")}catch(e){document.documentElement.classList.add("dark")}})()`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = localStorage.getItem("nx-theme");
    return stored === "light" ? "light" : "dark";
  });

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("nx-theme", next);
      document.documentElement.classList.toggle("light", next === "light");
      document.documentElement.classList.toggle("dark", next !== "light");
      return next;
    });
  }, []);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}
