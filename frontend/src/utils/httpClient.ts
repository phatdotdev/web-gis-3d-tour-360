import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens, notifyUnauthorized } from "./tokenStorage";

const rawBaseUrl = import.meta.env.VITE_BACKEND_URL as string | undefined;

const normalizeHost = (value?: string) => {
  const trimmed = value?.replace(/\/$/, "");
  if (!trimmed) return "http://localhost:3000";
  return trimmed.endsWith("/api") ? trimmed.slice(0, -4) : trimmed;
};

export const backendHost = normalizeHost(rawBaseUrl);

const normalizeBaseUrl = (value?: string) => {
  const trimmed = value?.replace(/\/$/, "");
  if (!trimmed) return "http://localhost:3000/api";
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const baseUrl = normalizeBaseUrl(rawBaseUrl);

export const httpClient = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

httpClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    const url = config?.url ?? "";

    if (
      error.response?.status === 401 &&
      config &&
      !config._retry &&
      !url.includes("/auth/login") &&
      !url.includes("/auth/register") &&
      !url.includes("/auth/refresh")
    ) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        notifyUnauthorized();
      } else {
        config._retry = true;
        try {
          const res = await axios.post(`${httpClient.defaults.baseURL}/auth/refresh`, { refreshToken });
          setTokens(res.data);
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return httpClient(config);
        } catch {
          clearTokens();
          notifyUnauthorized();
        }
      }
    }

    const message = error.response?.data?.message ?? error.message ?? "Lỗi không xác định từ server";
    const newError = new Error(message);
    newError.name = error.name;
    return Promise.reject(newError);
  },
);

export const resolveAssetUrl = (url?: string | null) => {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("file:")
  ) {
    return trimmed;
  }
  return `${backendHost}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
};
