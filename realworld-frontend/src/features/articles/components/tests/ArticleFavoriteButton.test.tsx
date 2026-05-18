import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ArticleFavoriteButton from "../ArticleFavoriteButton";

import { favoriteArticle, unfavoriteArticle } from "../../api/articlesApi";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

const mockNavigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/features/auth/hooks/useCurrentUser", () => ({
  useCurrentUser: vi.fn(() => ({
    data: {
      user: {
        username: "niko",
      },
    },
  })),
}));

vi.mock("../../api/articlesApi", () => ({
  favoriteArticle: vi.fn(),
  unfavoriteArticle: vi.fn(),
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

function createArticleResponse({
  favorited,
  favoritesCount,
}: {
  favorited: boolean;
  favoritesCount: number;
}) {
  return {
    article: {
      slug: "test-article",
      title: "Test Article",
      description: "Test description",
      body: "Test body",
      tagList: [],
      createdAt: "",
      updatedAt: "",
      favorited,
      favoritesCount,
      author: {
        username: "niko",
        bio: null,
        image: null,
        following: false,
      },
    },
  };
}

describe("ArticleFavoriteButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCurrentUser).mockReturnValue({
      data: {
        user: {
          username: "niko",
        },
      },
    } as never);
  });

  it("redirects to login when unauthenticated user clicks the button", async () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
    } as never);

    const user = userEvent.setup();

    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <ArticleFavoriteButton
          slug="test-article"
          favoritesCount={5}
          favorited={false}
          className=""
        />
      </QueryClientProvider>,
    );

    await user.click(
      screen.getByRole("button", {
        name: /5/i,
      }),
    );

    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/login",
    });
  });

  it("favorites article when authenticated user clicks unfavorited article", async () => {
    vi.mocked(favoriteArticle).mockResolvedValue(
      createArticleResponse({
        favorited: true,
        favoritesCount: 6,
      }),
    );

    const user = userEvent.setup();

    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <ArticleFavoriteButton
          slug="test-article"
          favoritesCount={5}
          favorited={false}
          className=""
        />
      </QueryClientProvider>,
    );

    await user.click(
      screen.getByRole("button", {
        name: /5/i,
      }),
    );

    await waitFor(() => {
      expect(favoriteArticle).toHaveBeenCalledWith("test-article");
    });

    expect(unfavoriteArticle).not.toHaveBeenCalled();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("unfavorites article when authenticated user clicks favorited article", async () => {
    vi.mocked(unfavoriteArticle).mockResolvedValue(
      createArticleResponse({
        favorited: false,
        favoritesCount: 4,
      }),
    );

    const user = userEvent.setup();

    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <ArticleFavoriteButton
          slug="test-article"
          favoritesCount={5}
          favorited
          className=""
        />
      </QueryClientProvider>,
    );

    await user.click(
      screen.getByRole("button", {
        name: /5/i,
      }),
    );

    await waitFor(() => {
      expect(unfavoriteArticle).toHaveBeenCalledWith("test-article");
    });

    expect(favoriteArticle).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
