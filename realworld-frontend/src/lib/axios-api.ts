import axios from "axios";
import { getToken, removeToken } from "./auth";
import { ApiError } from "./errors";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

function getErrorMessage(errorBody: unknown, status?: number) {
  let message = `Request failed: ${status ?? "unknown"}`;

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

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401) {
      removeToken();
    }

    const message = getErrorMessage(data, status);

    return Promise.reject(new ApiError(status, message, data));
  },
);
