import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import TagList from "../TagList";

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

describe("TagList", () => {
  it("renders all tags", () => {
    render(<TagList tags={["react", "typescript", "frontend"]} />);

    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("typescript")).toBeInTheDocument();
    expect(screen.getByText("frontend")).toBeInTheDocument();
  });

  it("renders tags as links", () => {
    render(<TagList tags={["react"]} />);

    const link = screen.getByRole("link", { name: "react" });

    expect(link).toHaveAttribute("href", "/?tag=react");
  });

  it("does not render tag links when tags array is empty", () => {
    render(<TagList tags={[]} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
