import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginUser, logoutUser } from "../api/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (payload) => {
    await loginUser(payload);
    const me = await getMe();
    setUser(me.data.user);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  useEffect(() => {
  const initAuth = async () => {
    try {
      const res = await getMe();
      setUser(res.data.user);
    } catch {
      // ❗ IMPORTANT CHANGE
      // Do NOT force user to null here
      // Let login() control it
    } finally {
      setLoading(false);
    }
  };

  initAuth();
}, []);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
