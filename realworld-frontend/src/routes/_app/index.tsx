import { createRoute } from "@tanstack/react-router";
import { Route as appRoute } from "../_app";
import HomePage from "@/features/articles/pages/HomePage";

export const Route = createRoute({
  getParentRoute: () => appRoute,
  path: "/",
  component: HomePage,
});
