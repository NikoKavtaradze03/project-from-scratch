import { getToken } from "./auth";
import { ApiError } from "./errors";
import { removeToken } from "./auth";

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
    let errorBody: unknown;

    try {
      errorBody = JSON.parse(responseText);
    } catch {
      errorBody = responseText;
    }

    let message = `Request failed: ${response.status}`;

    if (errorBody && typeof errorBody === "object" && "errors" in errorBody) {
      const errors = errorBody.errors;

      if (errors && typeof errors === "object") {
        const firstError = Object.values(errors)[0];

        if (Array.isArray(firstError)) {
          message = firstError[0];
        }
      }
    }

    if (response.status === 401) {
      removeToken();
    }

    throw new ApiError(response.status, message, errorBody);
  }

  if (!responseText) {
    throw new ApiError(
      response.status,
      "Expected response body but received none",
    );
  }

  if (!contentType?.includes("application/json")) {
    return responseText as T;
  }

  return JSON.parse(responseText) as T;
}

export async function apiFetchVoid(
  path: string,
  options: RequestInit = {},
): Promise<void> {
  await apiFetch<unknown>(path, options);
}
