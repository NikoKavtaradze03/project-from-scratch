import { createRoute } from "@tanstack/react-router";
import { Route as protectedRoute } from "../_protected";
import SettingsPage from "@/features/settings/pages/SettingsPage";

export const Route = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/settings",
  component: SettingsPage,
});
