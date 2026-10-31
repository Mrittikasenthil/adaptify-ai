import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const u = await api.getMe();
        if (u) {
          setUser(u);
        } else {
          // Default demo user so testing works instantly out of the box!
          setUser({
            id: "demo-user-id",
            email: "demo@brandflow.ai",
            full_name: "Alex Mercer (Demo)",
            created_at: "2026-01-01T00:00:00"
          });
        }
      } catch (e) {
        setUser({
          id: "demo-user-id",
          email: "demo@brandflow.ai",
          full_name: "Alex Mercer (Demo)",
          created_at: "2026-01-01T00:00:00"
        });
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    localStorage.setItem("brandflow_token", data.access_token);
    setUser(data.user);
    return data.user;
  };

  const register = async (email, password, full_name) => {
    const data = await api.register(email, password, full_name);
    localStorage.setItem("brandflow_token", data.access_token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("brandflow_token");
    setUser({
      id: "demo-user-id",
      email: "demo@brandflow.ai",
      full_name: "Alex Mercer (Demo)",
      created_at: "2026-01-01T00:00:00"
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
