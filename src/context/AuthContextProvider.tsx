import { useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { getStoredUser, getToken, login as loginService, logout as logoutService } from '../services/auth';

/** Provee la sesión (usuario + token) a toda la app y persiste el login. */
export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState<string | null>(getToken);

  const login = async (username: string, password: string): Promise<void> => {
    const logged = await loginService(username, password);
    setUser(logged);
    setToken(getToken());
  };

  const logout = (): void => {
    logoutService();
    setUser(null);
    setToken(null);
  };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
}
