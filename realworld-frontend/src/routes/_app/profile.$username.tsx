import { createRoute } from "@tanstack/react-router";
import { Route as appRoute } from "../_app";
import ProfilePage from "@/features/profile/pages/ProfilePage";

export const Route = createRoute({
  getParentRoute: () => appRoute,
  path: "/profile/$username",
  component: ProfilePage,
});
