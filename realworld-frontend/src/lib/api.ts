import { getToken } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const token = getToken();
  const hasBody = options?.body !== undefined;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  const responseText = await response.text();
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    if (responseText && contentType?.includes("application/json")) {
      const errorBody = JSON.parse(responseText) as {
        message?: string | string[];
        error?: string;
      };
      const message = Array.isArray(errorBody.message)
        ? errorBody.message.join(", ")
        : errorBody.message;

      throw new Error(message ?? errorBody.error ?? `Request failed: ${response.status}`);
    }

    throw new Error(responseText || `Request failed: ${response.status}`);
  }

  if (!responseText) {
    return undefined as T;
  }

  if (!contentType?.includes("application/json")) {
    return responseText as T;
  }

  return JSON.parse(responseText) as T;
}
