import { createRouter } from "@tanstack/react-router";

import { Route as rootRoute } from "@/routes/__root";
import { Route as indexRoute } from "@/routes/index";
import { Route as loginRoute } from "@/routes/login";
import { Route as registerRoute } from "@/routes/register";
import { Route as protectedRoute } from "@/routes/_protected";
import { Route as settingsRoute } from "@/routes/_protected/settings";
import { Route as editorRoute } from "@/routes/_protected/editor";
import { Route as editorSlugRoute } from "@/routes/_protected/editor.$slug";
import { Route as articleSlugRoute } from "@/routes/article.$slug";
import { Route as profileUsernameRoute } from "@/routes/profile.$username";

const protectedRouteTree = protectedRoute.addChildren([
  settingsRoute,
  editorRoute,
  editorSlugRoute,
]);

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  protectedRouteTree,
  articleSlugRoute,
  profileUsernameRoute,
]);

export const router = createRouter({
  routeTree,
});
