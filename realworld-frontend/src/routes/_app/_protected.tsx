import { Outlet, createRoute } from "@tanstack/react-router";
import { Route as appRoute } from "../_app";
import { requireAuth } from "@/lib/requireAuth";

export const Route = createRoute({
  getParentRoute: () => appRoute,
  id: "_protected",
  beforeLoad: ({ location }) => requireAuth(location),
  component: Outlet,
});
