"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // 1. When the page loads, check localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setTimeout(() => setIsDark(true), 0);
    }
  }, []);

  // 2. When clicked, toggle theme and save it
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="h-8 w-8 rounded-lg border border-border bg-background hover:bg-muted flex items-center justify-center cursor-pointer transition-colors text-foreground"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
      )}
    </button>
  );
}
