import { createRouter } from "@tanstack/react-router";

import { Route as rootRoute } from "@/routes/__root";
import { Route as indexRoute } from "@/routes/index";
import { Route as loginRoute } from "@/routes/login";
import { Route as registerRoute } from "@/routes/register";
import { Route as settingsRoute } from "@/routes/settings";
import { Route as editorRoute } from "@/routes/editor";
import { Route as editorSlugRoute } from "@/routes/editor.$slug";
import { Route as articleSlugRoute } from "@/routes/article.$slug";
import { Route as profileUsernameRoute } from "@/routes/profile.$username";

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  settingsRoute,
  editorRoute,
  editorSlugRoute,
  articleSlugRoute,
  profileUsernameRoute,
]);

export const router = createRouter({
  routeTree,
});
