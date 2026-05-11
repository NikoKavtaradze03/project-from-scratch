// src/lib/requireAuth.ts

import { redirect } from "@tanstack/react-router";
import { getToken } from "./auth";

export function requireAuth(location: { pathname: string }) {
  if (!getToken()) {
    throw redirect({
      to: "/login",
      search: {
        redirect: location.pathname,
      },
    });
  }
}
