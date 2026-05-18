import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LoginForm from "../LoginForm";
import { loginUser } from "../../api/authApi";
import { getToken } from "@/lib/auth";
import { queryKeys } from "@/lib/queryKeys";
import { ApiError } from "@/lib/errors";
import { Route } from "@/routes/login";

const mockNavigate = vi.fn();

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  const React = await import("react");

  return {
    ...actual,
    useMutation: ({
      mutationFn,
    }: {
      mutationFn: (variables: unknown) => Promise<unknown>;
    }) => {
      const [state, setState] = React.useState({
        error: null as Error | null,
        isError: false,
        isPending: false,
      });

      return {
        ...state,
        mutateAsync: async (variables: unknown) => {
          setState({
            error: null,
            isError: false,
            isPending: true,
          });

          try {
            const data = await mutationFn(variables);

            setState({
              error: null,
              isError: false,
              isPending: false,
            });

            return data;
          } catch (error) {
            setState({
              error: error as Error,
              isError: true,
              isPending: false,
            });

            return new Promise(() => {});
          }
        },
      };
    },
  };
});

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../api/authApi", () => ({
  loginUser: vi.fn(),
}));

vi.mock("@/routes/login", () => ({
  Route: {
    useSearch: vi.fn(() => ({})),
  },
}));

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function createLoginResponse() {
  return {
    user: {
      email: "niko@example.com",
      token: "fake-jwt-token",
      username: "niko",
      bio: null,
      image: null,
    },
  };
}

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("logs in user, stores token, updates current user cache, and navigates home", async () => {
    const user = userEvent.setup();

    const queryClient = createTestQueryClient();

    const loginResponse = createLoginResponse();

    vi.mocked(loginUser).mockResolvedValue(loginResponse);

    render(
      <QueryClientProvider client={queryClient}>
        <LoginForm />
      </QueryClientProvider>,
    );

    await user.type(screen.getByLabelText(/email/i), "niko@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalled();
    });

    expect(vi.mocked(loginUser).mock.calls[0]?.[0]).toEqual({
      email: "niko@example.com",
      password: "password123",
    });

    expect(getToken()).toBe("fake-jwt-token");

    expect(queryClient.getQueryData(queryKeys.auth.currentUser)).toEqual(
      loginResponse,
    );

    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/",
    });
  });

  it("shows backend error when login fails", async () => {
    const user = userEvent.setup();

    const queryClient = createTestQueryClient();

    vi.mocked(loginUser).mockRejectedValue(
      new ApiError(422, "email or password is invalid"),
    );

    render(
      <QueryClientProvider client={queryClient}>
        <LoginForm />
      </QueryClientProvider>,
    );

    await user.type(screen.getByLabelText(/email/i), "wrong@example.com");

    await user.type(screen.getByLabelText(/password/i), "wrongpassword");

    await user.click(
      screen.getByRole("button", {
        name: /sign in/i,
      }),
    );

    expect(await screen.findByText(/invalid/i)).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();

    expect(getToken()).toBeNull();

    expect(
      queryClient.getQueryData(queryKeys.auth.currentUser),
    ).toBeUndefined();
  });

  it("does not submit when fields are empty", async () => {
    const user = userEvent.setup();
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <LoginForm />
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();

    expect(loginUser).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(getToken()).toBeNull();
  });

  it("navigates to redirect path after successful login when redirect search param exists", async () => {
    const user = userEvent.setup();
    const queryClient = createTestQueryClient();

    vi.mocked(Route.useSearch).mockReturnValue({
      redirect: "/editor",
    } as never);

    vi.mocked(loginUser).mockResolvedValue(createLoginResponse());

    render(
      <QueryClientProvider client={queryClient}>
        <LoginForm />
      </QueryClientProvider>,
    );

    await user.type(screen.getByLabelText(/email/i), "niko@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/editor",
      });
    });
  });
});
