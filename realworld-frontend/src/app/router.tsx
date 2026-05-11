import { createRouter } from "@tanstack/react-router";

import { Route as rootRoute } from "@/routes/__root";
import { Route as appRoute } from "@/routes/_app";
import { Route as indexRoute } from "@/routes/_app/index";
import { Route as loginRoute } from "@/routes/login";
import { Route as registerRoute } from "@/routes/register";
import { Route as protectedRoute } from "@/routes/_app/_protected";
import { Route as settingsRoute } from "@/routes/_app/_protected/settings";
import { Route as editorRoute } from "@/routes/_app/_protected/editor";
import { Route as editorSlugRoute } from "@/routes/_app/_protected/editor.$slug";
import { Route as articleSlugRoute } from "@/routes/_app/article.$slug";
import { Route as profileUsernameRoute } from "@/routes/_app/profile.$username";

const protectedRouteTree = protectedRoute.addChildren([
  settingsRoute,
  editorRoute,
  editorSlugRoute,
]);

const appRouteTree = appRoute.addChildren([
  indexRoute,
  articleSlugRoute,
  profileUsernameRoute,
  protectedRouteTree,
]);

const routeTree = rootRoute.addChildren([
  appRouteTree,
  loginRoute,
  registerRoute,
]);

export const router = createRouter({
  routeTree,
});
