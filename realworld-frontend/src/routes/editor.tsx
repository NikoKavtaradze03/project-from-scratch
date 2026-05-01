import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import EditorPage from "../features/articles/pages/EditorPage";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/editor",
  component: EditorPage,
});
