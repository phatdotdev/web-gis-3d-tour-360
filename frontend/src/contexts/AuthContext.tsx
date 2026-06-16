import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as authService from "../services/authService";
import {
  getAccessToken,
  getRefreshToken,
  setTokens as storeTokens,
  clearTokens as removeTokens,
  registerUnauthorizedHandler,
} from "../utils/tokenStorage";

type User = {
  id?: string;
  email: string;
  displayName?: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email?: string, password?: string) => Promise<boolean>;
  register: (email?: string, displayName?: string, password?: string, role?: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      setUser(null);
    });

    const initAuth = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken && !refreshToken) {
        setIsInitializing(false);
        return;
      }

      try {
        if (!accessToken && refreshToken) {
          const data = await authService.refresh(refreshToken);
          storeTokens(data);
          setUser(data.user);
        } else {
          const data = await authService.me();
          setUser(data);
        }
      } catch (error) {
        removeTokens();
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();

    return () => {
      registerUnauthorizedHandler(null);
    };
  }, []);

  const login = async (email?: string, password?: string) => {
    const data = await authService.login(email, password);
    storeTokens(data);
    setUser(data.user);
    return true;
  };

  const register = async (email?: string, displayName?: string, password?: string, role?: string) => {
    const data = await authService.register(email, displayName, password, role);
    storeTokens(data);
    setUser(data.user);
    return true;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Ignore errors on logout
    } finally {
      removeTokens();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isInitializing,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
