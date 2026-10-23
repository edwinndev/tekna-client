import { AuthOutput, UserOutput } from "../types/auth";

const ACCESS_TOKEN_KEY = "tekna_access_token";
const REFRESH_TOKEN_KEY = "tekna_refresh_token";
const USER_KEY = "tekna_user";
const REMEMBER_ME_KEY = "tekna_remember_me";

class AuthStorageService {
  private getStorage(): Storage | null {
    if (typeof window === "undefined") {
      return null;
    }
    const isRemembered = localStorage.getItem(REMEMBER_ME_KEY) === "true";
    return isRemembered ? localStorage : sessionStorage;
  }

  public getAccessToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }
    return (
      localStorage.getItem(ACCESS_TOKEN_KEY) ||
      sessionStorage.getItem(ACCESS_TOKEN_KEY)
    );
  }

  public getRefreshToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }
    return (
      localStorage.getItem(REFRESH_TOKEN_KEY) ||
      sessionStorage.getItem(REFRESH_TOKEN_KEY)
    );
  }

  public getUser(): UserOutput | null {
    if (typeof window === "undefined") {
      return null;
    }
    const rawUser =
      localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (!rawUser) {
      return null;
    }
    try {
      const parsed = JSON.parse(rawUser) as UserOutput;
      return parsed;
    } catch {
      return null;
    }
  }

  public saveSession(auth: AuthOutput, rememberMe: boolean): void {
    if (typeof window === "undefined") {
      return;
    }

    this.clearSession();

    const targetStorage = rememberMe ? localStorage : sessionStorage;
    localStorage.setItem(REMEMBER_ME_KEY, String(rememberMe));
    targetStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
    targetStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
    targetStorage.setItem(USER_KEY, JSON.stringify(auth.user));
  }

  public updateTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === "undefined") {
      return;
    }
    const isRemembered = localStorage.getItem(REMEMBER_ME_KEY) === "true";
    const targetStorage = isRemembered ? localStorage : sessionStorage;

    targetStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    targetStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  public clearSession(): void {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);

    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }

  public isAuthenticated(): boolean {
    return Boolean(this.getAccessToken());
  }
}

export const authStorage = new AuthStorageService();
