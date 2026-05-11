import { createRoute } from "@tanstack/react-router";
import { Route as appRoute } from "../_app";
import ArticlePage from "@/features/articles/pages/ArticlePage";

export const Route = createRoute({
  getParentRoute: () => appRoute,
  path: "/article/$slug",
  component: ArticlePage,
});
