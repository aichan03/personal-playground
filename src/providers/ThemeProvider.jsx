// ThemeContext.jsx
import { createContext, useContext, useState, useMemo, useCallback } from "react";
import { theme as antdTheme } from "antd";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
   const [mode, setMode] = useState(() => localStorage.getItem("theme") || "light");
   const [primaryColor, setPrimaryColor] = useState("#1677ff");

   const toggleMode = useCallback(() => {
      setMode(prev => {
         const next = prev === "light" ? "dark" : "light";
         localStorage.setItem("theme", next);
         return next;
      });
   }, []);

   // 🔑 memoize the theme config object itself
   const themeConfig = useMemo(() => ({
      algorithm: mode === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
         colorPrimary: primaryColor,
         borderRadius: 8,
      },
   }), [mode, primaryColor]);

   // 🔑 memoize the context value too, so consumers don't re-render needlessly
   const value = useMemo(() => ({
      mode,
      toggleMode,
      primaryColor,
      setPrimaryColor,
      themeConfig,
   }), [mode, toggleMode, primaryColor, themeConfig]);

   return (
      <ThemeContext.Provider value={value}>
         {children}
      </ThemeContext.Provider>
   );
}

export const useAppTheme = () => useContext(ThemeContext);