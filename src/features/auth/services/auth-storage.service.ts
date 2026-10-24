import { getDefaultStore } from "jotai";
import {
  ACCESS_TOKEN_KEY,
  accessTokenAtom,
  clearSessionAtom,
  currentUserAtom,
  REFRESH_TOKEN_KEY,
  refreshTokenAtom,
  REMEMBER_ME_KEY,
  rememberMeAtom,
  saveSessionAtom,
  updateTokensAtom,
  USER_KEY,
} from "../atoms/auth.atoms";
import { AuthOutput, UserOutput } from "../types/auth";

class AuthStorageService {
  private get store() {
    return getDefaultStore();
  }

  private readFallbackItem(key: string): string | null {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      const raw: string | null = window.localStorage.getItem(key);
      if (raw === null) {
        return null;
      }
      try {
        return JSON.parse(raw) as string;
      } catch {
        return raw;
      }
    } catch {
      return null;
    }
  }

  public getAccessToken(): string | null {
    const fromAtom: string | null = this.store.get(accessTokenAtom);
    if (fromAtom) {
      return fromAtom;
    }
    return this.readFallbackItem(ACCESS_TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    const fromAtom: string | null = this.store.get(refreshTokenAtom);
    if (fromAtom) {
      return fromAtom;
    }
    return this.readFallbackItem(REFRESH_TOKEN_KEY);
  }

  public getUser(): UserOutput | null {
    const fromAtom: UserOutput | null = this.store.get(currentUserAtom);
    if (fromAtom) {
      return fromAtom;
    }
    if (typeof window === "undefined") {
      return null;
    }
    try {
      const raw: string | null = window.localStorage.getItem(USER_KEY);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw) as UserOutput;
    } catch {
      return null;
    }
  }

  public isRememberMe(): boolean {
    const fromAtom: boolean = this.store.get(rememberMeAtom);
    if (fromAtom) {
      return true;
    }
    if (typeof window === "undefined") {
      return false;
    }
    return window.localStorage.getItem(REMEMBER_ME_KEY) === "true";
  }

  public saveSession(auth: AuthOutput, rememberMe: boolean): void {
    this.store.set(saveSessionAtom, { auth, rememberMe });
  }

  public updateTokens(accessToken: string, refreshToken: string): void {
    this.store.set(updateTokensAtom, { accessToken, refreshToken });
  }

  public saveUser(user: UserOutput): void {
    this.store.set(currentUserAtom, user);
  }

  public clearSession(): void {
    this.store.set(clearSessionAtom);
  }

  public isAuthenticated(): boolean {
    return Boolean(this.getAccessToken());
  }
}

export const authStorage = new AuthStorageService();
