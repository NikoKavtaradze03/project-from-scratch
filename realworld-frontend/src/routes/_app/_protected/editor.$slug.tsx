import { createRoute } from "@tanstack/react-router";
import { Route as protectedRoute } from "../_protected";
import EditorPage from "@/features/articles/pages/EditorPage";

export const Route = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/editor/$slug",
  component: function EditorEdit() {
    const { slug } = Route.useParams();
    return <EditorPage mode="edit" slug={slug} />;
  },
});
