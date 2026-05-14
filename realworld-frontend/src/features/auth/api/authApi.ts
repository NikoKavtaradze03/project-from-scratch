import { apiFetch } from "@/lib/api";
import type {
  LoginCredentials,
  AuthResponse,
  RegisterCredentials,
  UpdateUserInput,
  UpdateUserResponse,
} from "../types/authTypes";

export function loginUser(credentials: LoginCredentials) {
  return apiFetch<AuthResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify({
      user: credentials,
    }),
  });
}

export function registerUser(credentials: RegisterCredentials) {
  return apiFetch<AuthResponse>("/users", {
    method: "POST",
    body: JSON.stringify({
      user: credentials,
    }),
  });
}

export function getCurrentUser() {
  return apiFetch<AuthResponse>("/user");
}

export function updateUser(input: UpdateUserInput) {
  return apiFetch<UpdateUserResponse>("/user", {
    method: "PUT",
    body: JSON.stringify({
      user: input,
    }),
  });
}
