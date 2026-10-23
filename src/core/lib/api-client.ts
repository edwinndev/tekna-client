import ky, { KyResponse } from "ky";
import { authStorage } from "@/features/auth/services/auth-storage.service";
import { AuthOutput, RefreshTokenInput } from "@/features/auth/types/auth";

const resolveApiPrefix = (): string => {
  if (typeof window !== "undefined") {
    return "/api/v1";
  }
  return (process.env.API_BACKEND_URL || "http://localhost:8081") + "/v1";
};

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = authStorage.getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const rawResponse: AuthOutput = await ky
      .post(`${resolveApiPrefix()}/auth/refresh`, {
        json: { refreshToken } satisfies RefreshTokenInput,
        retry: 0,
      })
      .json<AuthOutput>();

    authStorage.updateTokens(rawResponse.accessToken, rawResponse.refreshToken);
    return rawResponse.accessToken;
  } catch {
    authStorage.clearSession();
    return null;
  }
};

export const apiClient = ky.create({
  prefix: resolveApiPrefix(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  retry: {
    limit: 1,
    statusCodes: [408, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      ({ request }: { request: Request }) => {
        const token = authStorage.getAccessToken();
        if (token && !request.headers.has("Authorization")) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async ({
        request,
        response,
        retryCount,
      }: {
        request: Request;
        response: KyResponse;
        retryCount: number;
      }) => {
        if (response.status !== 401 || retryCount > 0) {
          return;
        }

        const isAuthEndpoint =
          request.url.includes("/auth/login") ||
          request.url.includes("/auth/refresh");

        if (isAuthEndpoint) {
          return;
        }

        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }

        const newAccessToken: string | null = await refreshPromise;
        if (!newAccessToken) {
          return;
        }

        const headers = new Headers(request.headers);
        headers.set("Authorization", `Bearer ${newAccessToken}`);

        return ky.retry({
          request: new Request(request, { headers }),
          code: "TOKEN_REFRESHED",
        });
      },
    ],
  },
});
