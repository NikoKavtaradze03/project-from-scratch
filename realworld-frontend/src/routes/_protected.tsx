import { Outlet, createRoute, redirect } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { getToken } from "@/lib/auth";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
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
