"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type AppTheme = "light" | "dark" | "system" | "Light" | "Blue Dark" | "Teal";
export type SidebarWidthMode = "Compact" | "Default" | "Wide";

interface ThemeContextValue {
  theme: AppTheme;
  isDark: boolean;
  sidebarWidth: SidebarWidthMode;
  setTheme: (theme: AppTheme) => void;
  setSidebarWidth: (width: SidebarWidthMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  isDark: false,
  sidebarWidth: "Default",
  setTheme: () => {},
  setSidebarWidth: () => {},
});

function resolveIsDark(theme: AppTheme): boolean {
  if (theme === "dark" || theme === "Blue Dark") return true;
  if (theme === "system") {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  }
  return false;
}

function applyThemeToDom(theme: AppTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const dark = resolveIsDark(theme);

  root.classList.remove("dark", "light");
  root.classList.add(dark ? "dark" : "light");

  if (theme === "Teal") {
    root.setAttribute("data-theme", "teal");
  } else if (dark) {
    root.setAttribute("data-theme", "dark");
  } else {
    root.setAttribute("data-theme", "light");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>("light");
  const [sidebarWidth, setSidebarWidthState] = useState<SidebarWidthMode>("Default");
  const [isDark, setIsDark] = useState(false);

  // Get user-specific storage key to avoid conflicts between users on same device
  const getThemeStorageKey = (): string => {
    if (typeof window === "undefined") return "pulmoai-theme";
    const userId = localStorage.getItem("userId") || localStorage.getItem("firebaseUid") || "default";
    return `pulmoai-theme-${userId}`;
  };

  const getSidebarStorageKey = (): string => {
    if (typeof window === "undefined") return "pulmoai-sidebar-width";
    const userId = localStorage.getItem("userId") || localStorage.getItem("firebaseUid") || "default";
    return `pulmoai-sidebar-width-${userId}`;
  };

  useEffect(() => {
    const themeKey = getThemeStorageKey();
    const sidebarKey = getSidebarStorageKey();
    
    const savedTheme = (localStorage.getItem(themeKey) as AppTheme) || "light";
    const savedWidth =
      (localStorage.getItem(sidebarKey) as SidebarWidthMode) || "Default";

    setThemeState(savedTheme);
    setSidebarWidthState(savedWidth);
    setIsDark(resolveIsDark(savedTheme));
    applyThemeToDom(savedTheme);
  }, []);

  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      setIsDark(media.matches);
      applyThemeToDom("system");
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  const setTheme = useCallback((nextTheme: AppTheme) => {
    setThemeState(nextTheme);
    setIsDark(resolveIsDark(nextTheme));
    if (typeof window !== "undefined") {
      const themeKey = `pulmoai-theme-${localStorage.getItem("userId") || localStorage.getItem("firebaseUid") || "default"}`;
      localStorage.setItem(themeKey, nextTheme);
    }
    applyThemeToDom(nextTheme);
  }, []);

  const setSidebarWidth = useCallback((nextWidth: SidebarWidthMode) => {
    setSidebarWidthState(nextWidth);
    if (typeof window !== "undefined") {
      const sidebarKey = `pulmoai-sidebar-width-${localStorage.getItem("userId") || localStorage.getItem("firebaseUid") || "default"}`;
      localStorage.setItem(sidebarKey, nextWidth);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, isDark, sidebarWidth, setTheme, setSidebarWidth }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
