import { createRoute } from "@tanstack/react-router";
import { Route as protectedRoute } from "../_protected";
import EditorPage from "@/features/articles/pages/EditorPage";

export const Route = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/editor",
  component: () => <EditorPage mode="create" />,
});
