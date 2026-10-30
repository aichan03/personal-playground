// providers/AuthProvider.jsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

export const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL,
   withCredentials: true,
});

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true); // true until /me finishes

   // On page load, ask the server if the cookie is a valid session
   useEffect(() => {
      api.get("/me")
         .then(({ data }) => setUser(data.user))
         .catch(() => setUser(null))
         .finally(() => setLoading(false));
   }, []);

   const login = useCallback(async ({ email, password, remember = true }) => {
      const { data } = await api.post("/login", { email, password, remember });
      setUser(data.user);
      return data.user;
   }, []);

   const logout = useCallback(async () => {
      try {
         await api.post("/logout");
      } finally {
         setUser(null);
      }
   }, []);

   const value = useMemo(
      () => ({ user, loading, isAuthenticated: !!user, login, logout }),
      [user, loading, login, logout]
   );

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);