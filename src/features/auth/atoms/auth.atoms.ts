import { atom } from "jotai";
import { atomWithStorage, RESET } from "jotai/utils";
import { createLocalStorageAdapter } from "@/core/store/local-storage-adapter";
import { AuthOutput, Role, UserOutput } from "../types/auth";

export const ACCESS_TOKEN_KEY = "tekna_access_token";
export const REFRESH_TOKEN_KEY = "tekna_refresh_token";
export const USER_KEY = "tekna_user";
export const REMEMBER_ME_KEY = "tekna_remember_me";

export const accessTokenAtom = atomWithStorage<string | null>(
  ACCESS_TOKEN_KEY,
  null,
  createLocalStorageAdapter<string | null>()
);

export const refreshTokenAtom = atomWithStorage<string | null>(
  REFRESH_TOKEN_KEY,
  null,
  createLocalStorageAdapter<string | null>()
);

export const currentUserAtom = atomWithStorage<UserOutput | null>(
  USER_KEY,
  null,
  createLocalStorageAdapter<UserOutput | null>()
);

export const rememberMeAtom = atomWithStorage<boolean>(
  REMEMBER_ME_KEY,
  false,
  createLocalStorageAdapter<boolean>()
);

export const authLoadingAtom = atom<boolean>(false);
export const authInitializedAtom = atom<boolean>(false);

export const isAuthenticatedAtom = atom<boolean>((get): boolean => {
  const token: string | null = get(accessTokenAtom);
  return Boolean(token);
});

export const userRoleAtom = atom<Role | null>((get): Role | null => {
  const user: UserOutput | null = get(currentUserAtom);
  return user ? user.role : null;
});

export const isAdminAtom = atom<boolean>((get): boolean => {
  return get(userRoleAtom) === "ADMIN";
});

export const isSellerAtom = atom<boolean>((get): boolean => {
  return get(userRoleAtom) === "SELLER";
});

export const isUserAtom = atom<boolean>((get): boolean => {
  return get(userRoleAtom) === "USER";
});

export const saveSessionAtom = atom<
  null,
  [{ auth: AuthOutput; rememberMe: boolean }],
  void
>(null, (_get, set, payload): void => {
  set(rememberMeAtom, payload.rememberMe);
  set(accessTokenAtom, payload.auth.accessToken);
  set(refreshTokenAtom, payload.auth.refreshToken);
  set(currentUserAtom, payload.auth.user);
});

export const updateTokensAtom = atom<
  null,
  [{ accessToken: string; refreshToken: string }],
  void
>(null, (_get, set, payload): void => {
  set(accessTokenAtom, payload.accessToken);
  set(refreshTokenAtom, payload.refreshToken);
});

export const clearSessionAtom = atom<null, [], void>(null, (_get, set): void => {
  set(accessTokenAtom, RESET);
  set(refreshTokenAtom, RESET);
  set(currentUserAtom, RESET);
  set(rememberMeAtom, RESET);
});
