import { apiClient } from "@/core/lib/api-client";
import {
  AuthOutput,
  LoginInput,
  RefreshTokenInput,
  UserOutput,
} from "../types/auth";
import { authStorage } from "./auth-storage.service";

class AuthService {
  public async login(
    input: LoginInput,
    rememberMe: boolean = false
  ): Promise<AuthOutput> {
    const response: AuthOutput = await apiClient
      .post("auth/login", {
        json: input,
      })
      .json<AuthOutput>();

    authStorage.saveSession(response, rememberMe);
    return response;
  }

  public async refreshToken(input: RefreshTokenInput): Promise<AuthOutput> {
    const response: AuthOutput = await apiClient
      .post("auth/refresh", {
        json: input,
      })
      .json<AuthOutput>();

    authStorage.updateTokens(response.accessToken, response.refreshToken);
    if (response.user) {
      authStorage.saveUser(response.user);
    }
    return response;
  }

  public async logout(): Promise<void> {
    const refreshToken = authStorage.getRefreshToken();
    if (refreshToken) {
      try {
        await apiClient.post("auth/logout", {
          json: { refreshToken } satisfies RefreshTokenInput,
        });
      } catch {
        // Silently continue if server session already expired
      }
    }
    authStorage.clearSession();
  }

  public async getMe(): Promise<UserOutput> {
    const user: UserOutput = await apiClient.get("auth/me").json<UserOutput>();
    authStorage.saveUser(user);
    return user;
  }
}

export const authService = new AuthService();
