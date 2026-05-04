import { apiFetch } from "@/lib/api";

type LoginCredentials = {
  email: string;
  password: string;
};

export type User = {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string | null;
};

type AuthResponse = {
  user: User;
};

export function loginUser(credentials: LoginCredentials) {
  return apiFetch<AuthResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify({
      user: credentials,
    }),
  });
}

type RegisterCredentials = {
  username: string;
  email: string;
  password: string;
};

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

type UpdateUserInput = {
  email?: string;
  username?: string;
  password?: string;
  bio?: string;
  image?: string;
};

type UpdateUserResponse = {
  user: User;
};

export function updateUser(input: UpdateUserInput) {
  return apiFetch<UpdateUserResponse>("/user", {
    method: "PUT",
    body: JSON.stringify({
      user: input,
    }),
  });
}
