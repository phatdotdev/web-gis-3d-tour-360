import { httpClient } from "../utils/httpClient";

const ENDPOINT = "/auth";

export const login = async (email?: string, password?: string) => {
  const { data } = await httpClient.post(`${ENDPOINT}/login`, { email, password });
  return data;
};

export const register = async (email?: string, displayName?: string, password?: string, role?: string) => {
  const { data } = await httpClient.post(`${ENDPOINT}/register`, { email, displayName, password, role });
  return data;
};

export const refresh = async (refreshToken?: string) => {
  const { data } = await httpClient.post(`${ENDPOINT}/refresh`, { refreshToken });
  return data;
};

export const me = async () => {
  const { data } = await httpClient.get(`${ENDPOINT}/me`);
  return data;
};

export const logout = async () => {
  await httpClient.post(`${ENDPOINT}/logout`);
};
