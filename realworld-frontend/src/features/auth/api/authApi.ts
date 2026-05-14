import { axiosFetch } from "@/lib/axios-api";
import type {
  LoginCredentials,
  AuthResponse,
  RegisterCredentials,
  UpdateUserInput,
  UpdateUserResponse,
} from "../types/authTypes";

export function loginUser(credentials: LoginCredentials) {
  return axiosFetch<AuthResponse>("/users/login", {
    method: "POST",
    body: {
      user: credentials,
    },
  });
}

export function registerUser(credentials: RegisterCredentials) {
  return axiosFetch<AuthResponse>("/users", {
    method: "POST",
    body: {
      user: credentials,
    },
  });
}

export function getCurrentUser() {
  return axiosFetch<AuthResponse>("/user");
}

export function updateUser(input: UpdateUserInput) {
  return axiosFetch<UpdateUserResponse>("/user", {
    method: "PUT",
    body: {
      user: input,
    },
  });
}
