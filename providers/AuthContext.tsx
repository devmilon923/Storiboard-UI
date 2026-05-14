"use client";

import { useLogout, useProfile } from "@/utils/api/endpoints";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  id: number;
  name: string;
  email: string;
  image: string;
  role: "admin" | "user" | "moderator";
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logoutHelper: () => void;
  hasRole: (role: string | string[]) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [manualUser, setManualUser] = useState<User | null>(null);
  const logout = useLogout();
  const { data: profileData, isLoading: isQueryLoading } = useProfile();
  const queryClient = useQueryClient();
  const user = manualUser || profileData || null;

  useEffect(() => {
    if (profileData) {
      setManualUser(profileData);
    }
  }, [profileData]);

  const logoutHelper = async () => {
    await logout.mutateAsync();
    setManualUser(null);
    queryClient.clear();
  };

  const hasRole = (role: string | string[]) => {
    if (!user) return false;

    if (typeof role === "string") {
      return user.role === role;
    }

    return role.includes(user.role);
  };


  const isLoading = isQueryLoading;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: setManualUser,
        logoutHelper,
        hasRole,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
