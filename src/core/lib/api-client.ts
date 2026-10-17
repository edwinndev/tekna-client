import ky from "ky";

const resolveApiPrefix = (): string => {
  if (typeof window !== "undefined") {
    return "/api/v1";
  }
  return (process.env.API_BACKEND_URL || "http://localhost:8081") + "/v1";
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
  },
});
