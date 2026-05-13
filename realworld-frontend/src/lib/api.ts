import { getToken, removeToken } from "./auth";
import { ApiError } from "./errors";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function buildHeaders(options?: RequestInit): HeadersInit {
  const token = getToken();
  const hasBody = options?.body !== undefined;

  return {
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...(options?.headers ?? {}),
  };
}

function getErrorMessage(errorBody: unknown, status: number) {
  let message = `Request failed: ${status}`;

  if (errorBody && typeof errorBody === "object" && "errors" in errorBody) {
    const errors = errorBody.errors;

    if (errors && typeof errors === "object") {
      const firstError = Object.values(errors)[0];

      if (Array.isArray(firstError)) {
        message = firstError[0];
      }
    }
  }

  return message;
}

function parseResponseBody(responseText: string, contentType: string | null) {
  if (!responseText) {
    return null;
  }

  if (!contentType?.includes("application/json")) {
    return responseText;
  }

  return JSON.parse(responseText);
}

async function request(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options),
  });

  const responseText = await response.text();
  const contentType = response.headers.get("content-type");

  const body = parseResponseBody(responseText, contentType);

  if (!response.ok) {
    const message = getErrorMessage(body, response.status);

    if (response.status === 401) {
      removeToken();
    }

    throw new ApiError(response.status, message, body);
  }

  return body;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const body = await request(path, options);

  if (body === null) {
    throw new ApiError(200, "Expected response body but received none");
  }

  return body as T;
}

export async function apiFetchVoid(
  path: string,
  options: RequestInit = {},
): Promise<void> {
  await request(path, options);
}
