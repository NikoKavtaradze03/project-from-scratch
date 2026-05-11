import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Route as rootRoute } from "./__root";
import LoginPage from "@/features/auth/pages/LoginPage";

const loginSearchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
});

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  validateSearch: loginSearchSchema,
  component: LoginPage,
});
