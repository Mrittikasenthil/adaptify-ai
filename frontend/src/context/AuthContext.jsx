import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: "user-mrittika-1",
  email: "mrittikasenthil21@gmail.com",
  full_name: "Mrittika",
  academic_level: "Undergraduate Engineering (Year 2)",
  created_at: "2026-01-01T00:00:00"
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("adaptify_user_profile");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_USER;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function syncBackendUser() {
      try {
        const u = await api.getMe();
        if (u && u.full_name && !u.full_name.includes("Alex")) {
          setUser((prev) => {
            const merged = { ...prev, ...u };
            localStorage.setItem("adaptify_user_profile", JSON.stringify(merged));
            return merged;
          });
        }
      } catch (e) {}
    }
    syncBackendUser();
  }, []);

  const updateProfile = (newDetails) => {
    setUser((prev) => {
      const updated = { ...(prev || DEFAULT_USER), ...newDetails };
      try {
        localStorage.setItem("adaptify_user_profile", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const login = async (email, password) => {
    const data = await api.login(email, password);
    localStorage.setItem("brandflow_token", data.access_token);
    setUser(data.user);
    localStorage.setItem("adaptify_user_profile", JSON.stringify(data.user));
    return data.user;
  };

  const register = async (email, password, full_name) => {
    const data = await api.register(email, password, full_name);
    localStorage.setItem("brandflow_token", data.access_token);
    setUser(data.user);
    localStorage.setItem("adaptify_user_profile", JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("brandflow_token");
    setUser(DEFAULT_USER);
    localStorage.setItem("adaptify_user_profile", JSON.stringify(DEFAULT_USER));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
