import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session on app start
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      setUser({ token });
    }

    setLoading(false);
  }, []);

  // Login
  const login = async (username, password) => {
    const res = await api.post("/auth/login/", {
      username,
      password,
    });

    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);

    setUser(res.data.user || { username });

    return res.data;
  };

  // Register
  const register = async (data) => {
    const res = await api.post("/auth/register/", data);
    return res.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setUser(null);

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!localStorage.getItem("access_token"),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
