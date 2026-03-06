import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function parseStoredUser() {
  const raw = localStorage.getItem('mediconnect-user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('mediconnect-token') || null);
  const [user, setUser] = useState(parseStoredUser);

  const login = ({ token: nextToken, user: nextUser }) => {
    setToken(nextToken);
    setUser(nextUser || null);

    localStorage.setItem('mediconnect-token', nextToken);
    localStorage.setItem('token', nextToken);
    if (nextUser) {
      localStorage.setItem('mediconnect-user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('mediconnect-user');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('mediconnect-token');
    localStorage.removeItem('mediconnect-user');
    localStorage.removeItem('token');
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
