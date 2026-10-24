"use client";

import { useCallback, useEffect } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  accessTokenAtom,
  authInitializedAtom,
  authLoadingAtom,
  clearSessionAtom,
  currentUserAtom,
  isAdminAtom,
  isAuthenticatedAtom,
  isSellerAtom,
  isUserAtom,
  refreshTokenAtom,
  saveSessionAtom,
  userRoleAtom,
} from "../atoms/auth.atoms";
import { authService } from "../services/auth.service";
import {
  AuthOutput,
  LoginInput,
  RefreshTokenInput,
  Role,
  UserOutput,
} from "../types/auth";

export {
  currentUserAtom,
  authLoadingAtom,
  authInitializedAtom,
  accessTokenAtom,
  refreshTokenAtom,
  isAuthenticatedAtom,
} from "../atoms/auth.atoms";

export function useAuth() {
  const [user, setUser] = useAtom(currentUserAtom);
  const [loading, setLoading] = useAtom(authLoadingAtom);
  const [initialized, setInitialized] = useAtom(authInitializedAtom);
  const accessToken = useAtomValue(accessTokenAtom);
  const refreshTokenValue = useAtomValue(refreshTokenAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const role: Role | null = useAtomValue(userRoleAtom);
  const isAdmin: boolean = useAtomValue(isAdminAtom);
  const isSeller: boolean = useAtomValue(isSellerAtom);
  const isUser: boolean = useAtomValue(isUserAtom);

  const saveSession = useSetAtom(saveSessionAtom);
  const clearSession = useSetAtom(clearSessionAtom);

  const fetchMe = useCallback(async (): Promise<UserOutput | null> => {
    if (!accessToken) {
      setUser(null);
      return null;
    }

    try {
      const userProfile: UserOutput = await authService.getMe();
      setUser(userProfile);
      return userProfile;
    } catch {
      clearSession();
      return null;
    }
  }, [accessToken, setUser, clearSession]);

  const refresh = useCallback(async (): Promise<AuthOutput | null> => {
    if (!refreshTokenValue) {
      return null;
    }

    try {
      const result: AuthOutput = await authService.refreshToken({
        refreshToken: refreshTokenValue,
      } satisfies RefreshTokenInput);
      saveSession({ auth: result, rememberMe: true });
      return result;
    } catch {
      clearSession();
      return null;
    }
  }, [refreshTokenValue, saveSession, clearSession]);

  useEffect(() => {
    if (initialized) {
      return;
    }

    if (accessToken) {
      fetchMe().finally((): void => {
        setInitialized(true);
      });
    } else {
      setInitialized(true);
    }
  }, [initialized, setInitialized, accessToken, fetchMe]);

  const login = useCallback(
    async (input: LoginInput, rememberMe: boolean): Promise<AuthOutput> => {
      setLoading(true);
      try {
        const authData: AuthOutput = await authService.login(input, rememberMe);
        saveSession({ auth: authData, rememberMe });
        return authData;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, saveSession]
  );

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearSession]);

  return {
    user,
    isAuthenticated,
    loading,
    initialized,
    role,
    isAdmin,
    isSeller,
    isUser,
    login,
    logout,
    refresh,
    fetchMe,
  };
}
