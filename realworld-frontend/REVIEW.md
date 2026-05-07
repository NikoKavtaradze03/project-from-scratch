# Code Review — `realworld-frontend`

A prioritized problems list with file links and code snippets. Each item shows the **current code**, **why it's a problem**, and **how it should look**. Items are ordered by impact / teaching value.

> Click any file link to jump to the source.

---

## Skill areas to focus on

1. **TanStack Router** — using `beforeLoad` / `loader` / `context` instead of in-component guards. (See [§ Router review](#router-review-tanstack-router) below.)
2. **TanStack Query patterns** — invalidate vs `setQueryData`, optimistic updates, sensible defaults.
3. **Form validation** — every form ships with none.
4. **Error handling end-to-end** — typed errors, surfacing server messages, error boundaries, 401 → logout.
5. **Security awareness** — JWT in `localStorage`, no XSS story, no auth-error path.
6. **Accessibility** — empty `alt`, icon-only buttons, missing labels.
7. **TypeScript hygiene** — `as T`, `strict: false`, untyped query errors.
8. **UX polish** — skeletons, optimistic UI, empty states, real error copy.

---

# Problems list

## 1. `setQueryData` followed by `invalidateQueries` on the same key

**File:** [src/features/auth/components/LoginForm.tsx](src/features/auth/components/LoginForm.tsx) (lines 25–30) — same pattern in `RegisterForm.tsx`

```tsx
const response = await loginMutation.mutateAsync(value);
setToken(response.user.token);
queryClient.setQueryData(queryKeys.auth.currentUser, response);
queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
navigate({ to: "/" });
```

**Why wrong:** `setQueryData` writes the response into the cache; `invalidateQueries` immediately marks it stale and triggers a refetch. The two cancel out and fire a duplicate `/user` GET.

**Fix:**

```tsx
const response = await loginMutation.mutateAsync(value);
setToken(response.user.token);
queryClient.setQueryData(queryKeys.auth.currentUser, response);
navigate({ to: "/" });
```

Rule: "I have the fresh data, store it" → `setQueryData`. "The cache is wrong, throw it away" → `invalidate`. Never both.

---

## 2. Over-broad invalidation on favorite/unfavorite

**File:** [src/features/articles/components/ArticleFavoriteButton.tsx](src/features/articles/components/ArticleFavoriteButton.tsx) (lines 30–38)

```tsx
onSuccess: async () => {
  await queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
  await queryClient.invalidateQueries({ queryKey: queryKeys.articles.detail(slug) });
},
```

**Why wrong:** `articles.all` is `["articles"]`, a *prefix* of `articles.detail(slug)` — the second line is dead code. And invalidating "all" refetches every paginated list and every cached detail on the page just because one heart was clicked.

**Fix — optimistic update, no refetch needed:**

```tsx
const favoriteMutation = useMutation({
  mutationFn: () => (favorited ? unfavoriteArticle(slug) : favoriteArticle(slug)),
  onMutate: async () => {
    await queryClient.cancelQueries({ queryKey: queryKeys.articles.detail(slug) });
    const previous = queryClient.getQueryData(queryKeys.articles.detail(slug));
    queryClient.setQueryData(queryKeys.articles.detail(slug), (old: any) =>
      old
        ? {
            article: {
              ...old.article,
              favorited: !favorited,
              favoritesCount: old.article.favoritesCount + (favorited ? -1 : 1),
            },
          }
        : old,
    );
    return { previous };
  },
  onError: (_e, _v, ctx) => {
    if (ctx?.previous) queryClient.setQueryData(queryKeys.articles.detail(slug), ctx.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.articles.detail(slug) });
  },
});
```

This is the "boss-fight" snippet — optimistic updates are the step from junior to mid-level React Query.

---

## 3. JWT stored in `localStorage`

**File:** [src/lib/auth.ts](src/lib/auth.ts) (lines 1–13)

```ts
const TOKEN_KEY = "jwtToken";
export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function setToken(token: string) { localStorage.setItem(TOKEN_KEY, token); }
```

**Why wrong:** Any XSS — a malicious comment, vulnerable dependency, third-party widget — can read `localStorage` and exfiltrate the token. The proper fix is httpOnly cookies + CSRF token (needs a backend change), so the goal here is *understanding the threat model*, not necessarily a code change.
A related missing piece — there's no centralized "auth error → log out" path. Add one inside `apiFetch`:

```ts
if (response.status === 401) {
  removeToken();
  throw new UnauthorizedError();
}
```

---

## 4. Untyped errors and `as T` casts in `apiFetch`

**File:** [src/lib/api.ts](src/lib/api.ts) (lines 24–48)

```ts
if (!response.ok) {
  ...
  throw new Error(message ?? errorBody.error ?? `Request failed: ${response.status}`);
}
if (!responseText) return undefined as T;
if (!contentType?.includes("application/json")) return responseText as T;
return JSON.parse(responseText) as T;
```

**Two problems:**

(a) `throw new Error(...)` loses the status code. Callers can't distinguish 401 / 404 / 500 / network. Introduce a typed error:

```ts
export class ApiError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message);
  }
}
```

…and use `instanceof ApiError` + `error.status` in hooks/components.

(b) `return undefined as T` is a lie to the type system. If the function says it returns `Promise<User>` and returns `undefined`, downstream `.user.username` explodes at runtime. Either type as `Promise<T | undefined>` or split into `apiFetch<T>` (asserts JSON) and `apiFetchVoid()` for empty-response endpoints.

---

## 5. No form validation anywhere

**File:** [src/features/auth/components/LoginForm.tsx](src/features/auth/components/LoginForm.tsx) — same gap in `RegisterForm`, `ArticleEditorForm`, `SettingsForm`, `CreateComment`

```tsx
<form.Field name="email">
  {(field) => (
    <AuthField
      id={field.name}
      label="Email"
      type="email"
      value={field.state.value}
      onChange={(value) => field.handleChange(value)}
      placeholder="you@example.com"
    />
  )}
</form.Field>
```

relying on `<input type="email">` and the server. `@tanstack/react-form` ships a validators API:

```tsx
<form.Field
  name="email"
  validators={{
    onBlur: ({ value }) =>
      !value
        ? "Email is required"
        : !/^\S+@\S+\.\S+$/.test(value)
          ? "Enter a valid email"
          : undefined,
  }}
>
  {(field) => (
    <>
      <AuthField id={field.name} label="Email" type="email"
        value={field.state.value}
        onChange={(value) => field.handleChange(value)}
        placeholder="you@example.com" />
      {field.state.meta.errors.length > 0 && (
        <p className="text-sm text-(--color-danger)">{field.state.meta.errors[0]}</p>
      )}
    </>
  )}
</form.Field>
```

Editor: `title` required, `body` required, `tagList` already deduped, max length on title.

---

## 6. Default `QueryClient` with no defaults

**File:** [src/app/queryClient.ts](src/app/queryClient.ts)

```ts
export const queryClient = new QueryClient();
```

`staleTime: 0` and `retry: 3` are the defaults — every navigation refetches, every failure retries thrice. For a content site:

```ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
});
```

open DevTools → Network on the home page, click around, and count requests before vs after.

---

## 7. State captured by closure inside a mutation

**File:** [src/features/comments/components/CreateComment.tsx](src/features/comments/components/CreateComment.tsx) (lines 14–30)

```tsx
const [commentBody, setCommentBody] = useState("");
const createCommentMutation = useMutation({
  mutationFn: () => createComment(slug, commentBody),
  onSuccess: async () => { setCommentBody(""); ... },
});

<form onSubmit={(event) => {
  event.preventDefault();
  if (!commentBody.trim()) return;
  createCommentMutation.mutate();
}}>
```

**Why wrong:** `mutationFn` captures `commentBody` from closure. The mutation isn't a pure function of its input — same instinct that bites on debouncing, intervals, and async event handlers.

**Fix — pass the input as an argument:**

```tsx
const createCommentMutation = useMutation({
  mutationFn: (body: string) => createComment(slug, body),
  onSuccess: async () => {
    setCommentBody("");
    await queryClient.invalidateQueries({ queryKey: queryKeys.comments.byArticle(slug) });
  },
});

// at submit:
createCommentMutation.mutate(commentBody.trim());
```

---

## 8. Loading / error / empty states are bare strings

**File:** [src/features/articles/components/ArticleFeed.tsx](src/features/articles/components/ArticleFeed.tsx) (lines 60–78)

```tsx
{isLoading ? (
  <p className="text-sm text-(--color-text-muted)">Loading articles...</p>
) : isError ? (
  <p className="text-sm text-(--color-danger)">Failed to load articles.</p>
) : (
  articlesResponse?.articles.map((article) => (
    <ArticlePreviewCard key={article.slug} article={article} />
  ))
)}
<Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
```

Three problems in one block:
- No skeleton — layout jumps when articles arrive.
- No empty state. Personal feed for a user who follows nobody renders nothing — but pagination still shows.
- Pagination renders during loading and on error.

**Fix — early return for each non-happy path:**

```tsx
if (isLoading) return <ArticleFeedSkeleton count={ARTICLES_PER_PAGE} />;
if (isError)  return <p className="text-sm text-(--color-danger)">Failed to load articles.</p>;

const articles = articlesResponse?.articles ?? [];
if (articles.length === 0) {
  return <p className="text-sm text-(--color-text-muted)">No articles yet.</p>;
}

return (
  <div className="flex flex-col gap-6">
    {articles.map((a) => <ArticlePreviewCard key={a.slug} article={a} />)}
    {totalPages > 1 && (
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    )}
  </div>
);
```

The "early return for loading/error/empty, happy path last" muscle is one of the most useful you can build.

---

## 9. Avatar `alt=""` and icon-only buttons

**Files:**
- [src/components/shared/UserAvatar.tsx](src/components/shared/UserAvatar.tsx)
- [src/features/articles/components/ArticleFavoriteButton.tsx](src/features/articles/components/ArticleFavoriteButton.tsx) (line 53)

```tsx
{image ? <AvatarImage src={image} alt="" /> : null}
...
<Heart /> {favoritesCount}
```

`alt=""` is correct for *purely decorative* images, but the avatar identifies the author — a screen reader user gets nothing. Should be `alt={username}`. The heart button has no accessible label, just an icon and a number — add `aria-label={favorited ? "Unfavorite" : "Favorite"}`.

Worth a single PR titled "a11y pass."

---

## 10. Generic mutation error text

**File:** [src/features/settings/pages/SettingsPage.tsx](src/features/settings/pages/SettingsPage.tsx) (lines 94–98) — same pattern in Login/Register.

```tsx
{updateUserMutation.isError ? (
  <p className="mt-4 text-sm text-(--color-danger)">Failed to update settings.</p>
) : null}
```

The NestJS API returns useful messages like `"email has already been taken"` — the user never sees them. Once `ApiError` from #4 exists:

```tsx
{updateUserMutation.isError && (
  <p className="text-sm text-(--color-danger)">
    {updateUserMutation.error instanceof ApiError
      ? updateUserMutation.error.message
      : "Something went wrong. Please try again."}
  </p>
)}
```

---

## 11. `useParams({ strict: false })` to silence the type checker

**File:** [src/features/articles/pages/EditorPage.tsx](src/features/articles/pages/EditorPage.tsx) (lines 39–40)

```ts
const params = useParams({ strict: false });
const slug = params.slug;
```

using `strict: false` to silence a TS error because `EditorPage` is mounted at *both* `/editor` and `/editor/$slug`. This throws away typed params. Better: split into two components, or use one parameterized route. (See router review § 3 below — the right fix is structural.)

Note that he *did* use the typed form in [`ArticlePage.tsx:25`](src/features/articles/pages/ArticlePage.tsx) — `useParams({ from: "/article/$slug" })`. So he knows the pattern; he just gave up here.

---

## 12. `key={tag}` on user-entered tags

**File:** [src/features/articles/components/ArticleEditorForm.tsx](src/features/articles/components/ArticleEditorForm.tsx) (lines 128–145)

```tsx
{field.state.value.map((tag) => (
  <button key={tag} ...>
```

guarding against duplicates in `addTag` (line 101: `if (!field.state.value.includes(tag))`), so this is correct *today*. The risk: this depends on a runtime invariant the type system doesn't enforce. If anyone removes the dedup later, React silently misrenders. Lesson: keys are a contract — be deliberate.

---

# Router review (TanStack Router)

 The router setup is **technically correct but architecturally underused** — every route is the bare minimum (`getParentRoute`, `path`, `component`), and all the data-fetching, auth-gating, and loading UX lives in the components instead. TanStack Router's whole value proposition is moving those concerns into the route definition. you are currently using ~10% of what the library offers.

### Files
- Router assembly: [src/app/router.tsx](src/app/router.tsx)
- Root: [src/routes/__root.tsx](src/routes/__root.tsx)
- Routes: [`index.tsx`](src/routes/index.tsx), [`login.tsx`](src/routes/login.tsx), [`register.tsx`](src/routes/register.tsx), [`settings.tsx`](src/routes/settings.tsx), [`editor.tsx`](src/routes/editor.tsx), [`editor.$slug.tsx`](src/routes/editor.$slug.tsx), [`article.$slug.tsx`](src/routes/article.$slug.tsx), [`profile.$username.tsx`](src/routes/profile.$username.tsx)
- Mount: [src/main.tsx](src/main.tsx)

### What's good
- `code-based routing` is set up correctly with one file per route.
- File naming convention (`article.$slug.tsx`) is consistent.
- you correctly use `useParams({ from: ... })` in `ArticlePage`.

### Problems

---

### R1. Auth guards are inside components, not in `beforeLoad`

**Where it shows up:**
- [src/features/articles/pages/EditorPage.tsx:84-96](src/features/articles/pages/EditorPage.tsx)
- [src/features/settings/pages/SettingsPage.tsx:56-70](src/features/settings/pages/SettingsPage.tsx)

```tsx
// EditorPage
const { data: currentUserResponse, isLoading: isCurrentUserLoading } = useCurrentUser();

if (isCurrentUserLoading) {
  return <main><PageContainer><p>Loading...</p></PageContainer></main>;
}
if (!currentUserResponse?.user) {
  return <Navigate to="/login" />;
}
```

**Why wrong:** Three failures stacked together:
1. **Flash of unauthenticated UI.** The component mounts, fetches `/user`, shows "Loading...", then redirects. The user sees a flicker on every protected route entry.
2. **No URL preservation.** When redirected to `/login`, there's no `redirect` query param, so after login they land on `/` instead of where they meant to go.
3. **Wrong layer.** The page renders before auth is decided. With `beforeLoad`, navigation is blocked at the router and the component is never even constructed.

**Fix — move the guard into the route file:**

```tsx
// src/routes/settings.tsx
import { createRoute, redirect } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { queryClient } from "@/app/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { getCurrentUser } from "@/features/auth/api/authApi";
import { getToken } from "@/lib/auth";
import SettingsPage from "@/features/settings/pages/SettingsPage";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  beforeLoad: async ({ location }) => {
    if (!getToken()) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
    // Verify the token by hydrating the cache; this becomes synchronous on subsequent navigations.
    await queryClient.ensureQueryData({
      queryKey: queryKeys.auth.currentUser,
      queryFn: getCurrentUser,
    });
  },
  component: SettingsPage,
});
```

Now `SettingsPage` can assume `currentUser` exists — no `if (!currentUser) return <Navigate />` needed.

Apply the same to `/settings`, `/editor`, `/editor/$slug`.

For `/login` and `/register`, do the *opposite* — redirect already-logged-in users away:

```tsx
beforeLoad: () => {
  if (getToken()) throw redirect({ to: "/" });
},
```

---

### R2. No `loader` — every page shows a spinner on entry

**Where it shows up:**
- [src/features/articles/pages/ArticlePage.tsx:38-52](src/features/articles/pages/ArticlePage.tsx)
- [src/features/articles/pages/EditorPage.tsx:46-50](src/features/articles/pages/EditorPage.tsx)
- All other pages.

```tsx
// ArticlePage
const { data, isLoading, isError } = useQuery({
  queryKey: queryKeys.articles.detail(slug),
  queryFn: () => getArticle(slug),
});
if (isLoading) return <p>Loading article...</p>;
```

**Why wrong:** TanStack Router's `loader` runs **before** the component renders. Combined with React Query's `ensureQueryData`, the page paints with data already in cache — no spinner, no layout shift.

**Fix:**

```tsx
// src/routes/article.$slug.tsx
export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/article/$slug",
  loader: ({ params }) =>
    queryClient.ensureQueryData({
      queryKey: queryKeys.articles.detail(params.slug),
      queryFn: () => getArticle(params.slug),
    }),
  pendingComponent: ArticleSkeleton,   // shown only on slow networks
  errorComponent: ArticleErrorFallback,
  component: ArticlePage,
});
```

Then the page can just call `useSuspenseQuery` (or normal `useQuery` — it'll be instant) without `if (isLoading)` branches.

---

### R3. `EditorPage` mounted at two routes, papered over with `strict: false`

**Files:**
- [src/routes/editor.tsx](src/routes/editor.tsx) — `/editor`
- [src/routes/editor.$slug.tsx](src/routes/editor.$slug.tsx) — `/editor/$slug`
- [src/features/articles/pages/EditorPage.tsx:39-40](src/features/articles/pages/EditorPage.tsx)

```ts
const params = useParams({ strict: false });
const slug = params.slug;
const isEditMode = Boolean(slug);
```

**Why wrong:** Two separate routes share one component that has to runtime-detect "am I in create mode or edit mode?", and TS strictness has to be turned off to allow it. The route layer already knows the answer — let it.

**Fix — pass mode through the route, not detected at runtime:**

```tsx
// src/routes/editor.tsx
export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/editor",
  beforeLoad: requireAuth,
  component: () => <EditorPage mode="create" />,
});

// src/routes/editor.$slug.tsx
export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/editor/$slug",
  beforeLoad: requireAuth,
  loader: ({ params }) => queryClient.ensureQueryData({
    queryKey: queryKeys.articles.detail(params.slug),
    queryFn: () => getArticle(params.slug),
  }),
  component: function EditorEdit() {
    const { slug } = Route.useParams();
    return <EditorPage mode="edit" slug={slug} />;
  },
});
```

Now `EditorPage` accepts a discriminated-union prop and `strict: false` disappears.

---

### R4. Search/filter state isn't in the URL (`validateSearch`)

**Where it shows up:**
- [src/features/articles/components/ArticleFeed.tsx:21](src/features/articles/components/ArticleFeed.tsx)
- [src/features/profile/components/ProfileTabs.tsx](src/features/profile/components/ProfileTabs.tsx)

```tsx
const [page, setPage] = useState(1);
```

**Why wrong:** Pagination, active feed (global vs personal), tag filter — all are component-local `useState`. Refresh, share a link, or come back via browser-back, and you're on page 1 again. URLs should be the source of truth for view state.

**Fix — `validateSearch` on the route, then `Route.useSearch()` and `navigate({ search })`:**

```tsx
// src/routes/index.tsx
import { z } from "zod";

const homeSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  feed: z.enum(["global", "personal"]).catch("global"),
  tag: z.string().optional(),
});

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: homeSearchSchema,
  component: HomePage,
});
```

In the component:

```tsx
const { page, feed, tag } = Route.useSearch();
const navigate = Route.useNavigate();
const setPage = (p: number) => navigate({ search: (prev) => ({ ...prev, page: p }) });
```

Bonus: this pairs with `loader` so the loader can fetch the right page directly.

---

### R5. Router has no `context` — loaders can't reach the QueryClient cleanly

**File:** [src/app/router.tsx](src/app/router.tsx)

```ts
export const router = createRouter({ routeTree });
```

**Why wrong:** Loaders currently have to import `queryClient` directly from `@/app/queryClient` — it works, but it ties every route to a singleton, complicates tests, and prevents typed loader context.

**Fix:**

```tsx
// src/app/router.tsx
import { createRouter } from "@tanstack/react-router";
import { queryClient } from "./queryClient";

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent", // bonus: prefetch on link hover
  defaultPendingMs: 200,    // don't flash spinner for fast loads
});

declare module "@tanstack/react-router" {
  interface Register { router: typeof router }
}
```

```tsx
// src/routes/__root.tsx
import { createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
});
```

Now `loader: ({ context }) => context.queryClient.ensureQueryData(...)` is typed and testable.

---

### R6. No `notFoundComponent` and no global `errorComponent`

**File:** [src/routes/__root.tsx](src/routes/__root.tsx)

```ts
export const Route = createRootRoute({ component: RootLayout });
```

**Why wrong:** Hit `/foo` and TanStack falls through to a generic match-all. If a loader throws (article doesn't exist, server is down), there's no route-level fallback — the page just shows "Failed to load."

**Fix:**

```tsx
export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
  errorComponent: GlobalErrorFallback,
});
```

And in `article.$slug.tsx`, throw a 404 from the loader when `getArticle` fails:

```ts
loader: async ({ params }) => {
  try {
    return await queryClient.ensureQueryData({
      queryKey: queryKeys.articles.detail(params.slug),
      queryFn: () => getArticle(params.slug),
    });
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) throw notFound();
    throw e;
  }
},
```

---

### R7. `defaultPreload: "intent"` is a free win

Once the loaders exist, add `defaultPreload: "intent"` to the router config (shown in R5). Hovering a `<Link>` prefetches the loader so the next click is instant. Costs nothing, feels great.

---

### R8. Logout doesn't go through the router

**File:** [src/features/settings/pages/SettingsPage.tsx:35-44](src/features/settings/pages/SettingsPage.tsx)

```tsx
function handleLogout() {
  removeToken();
  queryClient.setQueryData(queryKeys.auth.currentUser, null);
  queryClient.removeQueries({ queryKey: queryKeys.auth.currentUser });
  navigate({ to: "/" });
}
```

This is fine, but once R1 is in place, every protected route will already redirect on a missing token. The logout flow becomes:

```tsx
function handleLogout() {
  removeToken();
  queryClient.clear();              // nuke all caches
  router.invalidate();               // re-run beforeLoad on the current match
  navigate({ to: "/login" });
}
```

`router.invalidate()` is the piece he's missing — it forces all `beforeLoad` and `loader` to re-run, which kicks the user out of any protected page they're currently viewing.

---

# Smaller things (one PR titled "small fixes")

- [src/app/queryClient.ts](src/app/queryClient.ts): export a `clearAuthCache()` helper used in both logout and 401 handling.
- [src/features/articles/components/ArticleMeta.tsx](src/features/articles/components/ArticleMeta.tsx) (line 22): `createdAt.trim().split("T")[0]` — works, but `new Date(createdAt).toLocaleDateString()` is one line and locale-aware.
- No global `ErrorBoundary` around `RootLayout`. If any synchronous render throws, the whole app whites out.
- Mixed conventions: some files `export default function X(){}`, some `function X(){} export default X;`. Pick one.
- `tsconfig.app.json`: confirm `strict: true`. If it's already on, great; if not, that's the single biggest TS lever.
- No `.env.example` for `VITE_API_BASE_URL` — onboarding hazard.
- No tests at all. One Vitest + React Testing Library test on `LoginForm` (renders, submits, shows error) is more educational than ten. Pair this with the form-validation work in #5.