import { Outlet, createRoute, redirect } from "@tanstack/react-router";
import { Route as appRoute } from "../_app";
import { getToken } from "@/lib/auth";

export const Route = createRoute({
  getParentRoute: () => appRoute,
  id: "_protected",
  beforeLoad: ({ location }) => {
    if (!getToken()) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Outlet,
});
