"use client";

import { useCallback, useEffect } from "react";
import { atom, useAtom } from "jotai";
import { authService } from "../services/auth.service";
import { authStorage } from "../services/auth-storage.service";
import { AuthOutput, LoginInput, UserOutput } from "../types/auth";

export const currentUserAtom = atom<UserOutput | null>(null);
export const authLoadingAtom = atom<boolean>(false);

export function useAuth() {
  const [user, setUser] = useAtom(currentUserAtom);
  const [loading, setLoading] = useAtom(authLoadingAtom);

  useEffect(() => {
    const cachedUser = authStorage.getUser();
    if (cachedUser && !user) {
      setUser(cachedUser);
    }
  }, [user, setUser]);

  const login = useCallback(
    async (input: LoginInput, rememberMe: boolean): Promise<AuthOutput> => {
      setLoading(true);
      try {
        const authData: AuthOutput = await authService.login(input, rememberMe);
        setUser(authData.user);
        return authData;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setUser]
  );

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setUser]);

  return {
    user,
    isAuthenticated: Boolean(user || authStorage.isAuthenticated()),
    loading,
    login,
    logout,
  };
}
