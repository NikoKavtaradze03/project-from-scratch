import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import ArticlePage from "@/features/articles/pages/ArticlePage";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/article/$slug",
  component: ArticlePage,
});
