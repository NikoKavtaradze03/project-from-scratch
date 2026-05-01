import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import ProfilePage from "@/features/profile/pages/ProfilePage";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/$username",
  component: ProfilePage,
});
