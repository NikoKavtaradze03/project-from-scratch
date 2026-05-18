import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AxiosMockAdapter from "axios-mock-adapter";

import { api } from "@/lib/axios-api";
import PopularTagsCard from "../PopularTagsCard";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    search,
    className,
  }: {
    children: React.ReactNode;
    to: string;
    search?: { tag?: string };
    className?: string;
  }) => (
    <a href={`${to}?tag=${search?.tag}`} className={className}>
      {children}
    </a>
  ),
}));

const mock = new AxiosMockAdapter(api);

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

describe("PopularTagsCard", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("renders fetched tags", async () => {
    mock.onGet("/tags").reply(200, {
      tags: ["react", "typescript"],
    });

    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <PopularTagsCard />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/popular tags/i)).toBeInTheDocument();

    expect(await screen.findByText("react")).toBeInTheDocument();
    expect(await screen.findByText("typescript")).toBeInTheDocument();
  });
});
