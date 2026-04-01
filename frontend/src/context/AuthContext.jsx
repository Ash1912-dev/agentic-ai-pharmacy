import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginUser, logoutUser } from "../api/auth.api";
import { setAuthToken, getAuthToken } from "../api/axiosInstance";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (payload) => {
    const res = await loginUser(payload);
    setAuthToken(res.data?.token);
    const me = await getMe();
    setUser(me.data.user);
  };

  const logout = async () => {
    await logoutUser();
    setAuthToken(null);
    setUser(null);
  };

  useEffect(() => {
  const initAuth = async () => {
    if (!getAuthToken()) {
      setLoading(false);
      return;
    }

    try {
      const res = await getMe();
      setUser(res.data.user);
    } catch {
      setAuthToken(null);
      setUser(null);
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
