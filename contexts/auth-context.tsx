"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types/auth";
import * as authService from "../services/auth-service";
import { AuthContextType } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("playlearn_user");
    const savedToken = localStorage.getItem("playlearn_token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password });
    setUser(res.user);
    setToken(res.access_token);
    localStorage.setItem("playlearn_user", JSON.stringify(res.user));
    localStorage.setItem("playlearn_token", res.access_token);
  };

  const signup = async (name: string, email: string, password: string) => {
    const res = await authService.signup({ name, email, password });
    setUser(res.user);
    setToken(res.access_token);
    localStorage.setItem("playlearn_user", JSON.stringify(res.user));
    localStorage.setItem("playlearn_token", res.access_token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("playlearn_user");
    localStorage.removeItem("playlearn_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
