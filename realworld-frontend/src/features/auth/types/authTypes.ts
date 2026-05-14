export type LoginCredentials = {
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

export type AuthResponse = {
  user: User;
};

export type RegisterCredentials = {
  username: string;
  email: string;
  password: string;
};

export type UpdateUserInput = {
  email?: string;
  username?: string;
  password?: string;
  bio?: string;
  image?: string;
};

export type UpdateUserResponse = {
  user: User;
};
